import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpotifyService } from 'src/core/services/spotify.service';
import { SpotifyTrackType } from 'src/core/types/spotify-album-track.type';
import { SpotifyAlbumType } from 'src/core/types/spotify-album.type';
import { SpotifyArtistType } from 'src/core/types/spotify-artist.type';
import { slugify } from 'src/core/utils/index';
import { Album, AlbumDocument } from 'src/database/spotify/album.schema';
import { Artist, ArtistDocument } from 'src/database/spotify/artist.schema';
import { Genre, GenreDocument } from 'src/database/spotify/genre.schema';
import { Track, TrackDocument } from 'src/database/spotify/track.schema';

@Injectable()
export class SpotifyAdminService {
  private readonly logger = new Logger(SpotifyAdminService.name);
  constructor(
    private readonly spotifyService: SpotifyService,
    @InjectModel(Genre.name)
    private genreModel: Model<GenreDocument>,
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}

  async syncArtists(artistIds: string[]) {
    const { artists } = await this.spotifyService.getArtists(artistIds);
    // init genres
    await this.initGenres(artists);

    for (const artist of artists) {
      await this.initArtist(artist);

      const albums = await this.spotifyService.getArtistAlbums(
        artist.id,
        50,
        0,
      );

      for (const album of albums.items) {
        await this.initAlbum(album);

        const tracks = await this.spotifyService.getAlbumsTracks(
          album.id,
          50,
          0,
        );
        for (const track of tracks.items) {
          await this.initTrack(track, album.id);
        }
      }
    }
    return artists;
  }

  private async initGenres(artists: SpotifyArtistType[]) {
    const geres: GenreDocument[] = Array.from(
      new Map(
        artists
          .map((artist) => artist.genres)
          .flat()
          .map((genre) => [genre, genre]),
      ).values(),
    ).map(
      (genre) => new this.genreModel({ name: genre, slug: slugify(genre) }),
    );

    await Promise.all(
      geres.map(async (tag) => {
        try {
          await tag.save();
          this.logger.debug(`saving tag: ${tag.id}`);
        } catch (error) {
          this.logger.debug(`saving dupplicate tag: ${tag.id}`);
        }
      }),
    );
  }

  private async initArtist(artist: SpotifyArtistType): Promise<ArtistDocument> {
    const artistExist = await this.artistModel.findOne({ id: artist.id });
    const genres = await this.genreModel.find({ name: { $in: artist.genres } });
    const genreRefs = genres.map((genre) => genre.id);

    if (artistExist) {
      this.logger.debug(
        `Updating existing artist: ${artist.id} : ${artist.name}`,
      );
      const artistUpdated = await this.artistModel.findOneAndUpdate(
        { id: artist.id },
        { ...artist, genres: genreRefs, updatedAt: new Date() },
        { new: true },
      );
      if (!artistUpdated) {
        throw new Error(
          `Failed to update artist: ${artist.id} : ${artist.name}`,
        );
      }
      return artistUpdated;
    }

    const artistNew = await this.artistModel.create({
      ...artist,
      genres: genreRefs,
    });
    this.logger.debug(
      `Created new artist: ${artistNew.id} : ${artistNew.name}`,
    );
    return artistNew;
  }

  private async initAlbum(album: SpotifyAlbumType): Promise<AlbumDocument> {
    const albumExist = await this.albumModel.findOne({ id: album.id });
    const artistRefs = await this.artistModel.find({
      id: { $in: album.artists.map((artist) => artist.id) },
    });
    const artistRefsIds = artistRefs.map((artist) => artist._id);

    if (albumExist) {
      this.logger.debug(`Updating existing album: ${album.id} : ${album.name}`);
      const albumUpdated = await this.albumModel.findOneAndUpdate(
        { id: album.id },
        { ...album, artistRefs: artistRefsIds, updatedAt: new Date() },
        { new: true },
      );
      if (!albumUpdated) {
        throw new Error(`Failed to update album: ${album.id} : ${album.name}`);
      }
      return albumUpdated;
    }

    // Create a new album if it does not exist
    const albumNew = await this.albumModel.create({
      ...album,
      artistRefs: artistRefsIds,
    });
    this.logger.debug(`Created new album: ${albumNew.id} : ${albumNew.name}`);
    return albumNew;
  }

  private async initTrack(
    track: SpotifyTrackType,
    albumId: string,
  ): Promise<TrackDocument> {
    const trackExist = await this.trackModel.findOne({ id: track.id });

    // First, get all artist references by ids from track.artists
    const artistRefs = await this.artistModel.find({
      id: { $in: track.artists.map((artist) => artist.id) },
    });
    const artistRefsIds = artistRefs.map((artist) => artist._id);

    // Next, get album reference by id
    const albumRef = await this.albumModel.findOne({ id: albumId });
    const albumRefId = albumRef ? albumRef._id : null;

    if (trackExist) {
      this.logger.debug(`Updating existing track: ${track.id} : ${track.name}`);
      const trackUpdated = await this.trackModel.findOneAndUpdate(
        { id: track.id },
        {
          ...track,
          artistRefs: artistRefsIds,
          albumRef: albumRefId,
          updatedAt: new Date(),
        },
        { new: true },
      );
      if (!trackUpdated) {
        throw new Error(`Failed to update track: ${track.id} : ${track.name}`);
      }
      return trackUpdated;
    }

    // If no existing track, create one
    const trackNew = await this.trackModel.create({
      ...track,
      artistRefs: artistRefsIds,
      albumRef: albumRefId,
    });

    this.logger.debug(`Created new track: ${trackNew.id} : ${trackNew.name}`);
    return trackNew;
  }
}
