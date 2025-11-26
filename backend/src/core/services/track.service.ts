import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PlaylistService } from 'src/core/services/playlist.service';
import { SpotifyService } from 'src/core/services/spotify.service';
import { Album, AlbumDocument } from 'src/database/spotify/album.schema';
import { Artist, ArtistDocument } from 'src/database/spotify/artist.schema';
import { Genre, GenreDocument } from 'src/database/spotify/genre.schema';
import { Track, TrackDocument } from 'src/database/spotify/track.schema';

@Injectable()
export class TrackService {
  private readonly logger = new Logger(TrackService.name);
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
    private readonly playlistService: PlaylistService,
  ) {}

  async getMostPopular({
    limit = 50,
    skip = 0,
    query = '',
  }: {
    limit?: number;
    skip?: number;
    query?: string;
  }) {
    const [results, total] = await Promise.all([
      this.trackModel
        .find({ deletedAt: null, name: { $regex: query, $options: 'i' } })
        .sort({ playCount: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('artistRefs')
        .populate('albumRef'),
      this.trackModel.countDocuments({ deletedAt: null }),
    ]);
    const hasNext = skip + limit < total;
    return {
      items: results,
      total,
      hasNext,
      limit,
      skip,
    };
  }

  async getRandom({ limit = 10 }: { limit?: number }) {
    // Use MongoDB's $sample aggregation to get random tracks, with population of referenced data.
    const tracks = await this.trackModel.aggregate([
      { $match: { deletedAt: null } },
      { $sample: { size: limit } },
      // Optionally, add skip by slicing after $sample if skip is provided
    ]);

    // Populate artistRefs and albumRef for each result
    const populatedTracks = await this.trackModel.populate(tracks, [
      { path: 'artistRefs' },
      { path: 'albumRef' },
    ]);
    return populatedTracks;
  }

  async getTrack(_id: string) {
    const track = await this.trackModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(_id) },
        { $inc: { playCount: 1 } },
        { new: true },
      )
      .populate('artistRefs')
      .populate('albumRef');
    return track;
  }

  async getTrackByArtist(
    _id: string,
    { limit = 10, skip = 0 }: { limit?: number; skip?: number },
  ) {
    // artistRefs is an array of Artist (Artist[]), so we query using the _id in the array using $in.
    const artistObjectId = new Types.ObjectId(_id);
    const [tracks, total] = await Promise.all([
      this.trackModel
        .find({
          artistRefs: { $in: [artistObjectId] },
          deletedAt: null,
        })
        .sort({ playCount: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('artistRefs')
        .populate('albumRef'),
      this.trackModel.countDocuments({
        artistRefs: { $in: [artistObjectId] },
        deletedAt: null,
      }),
    ]);
    const hasNext = skip + limit < total;
    return {
      items: tracks,
      total,
      hasNext,
      limit,
      skip,
    };
  }

  async getTrackByPlaylist(
    slug: string,
    { limit = 10, skip = 0 }: { limit?: number; skip?: number } = {},
  ) {
    return this.playlistService.getPlaylistTracksBySlug(slug, { limit, skip });
  }
}
