import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpotifyService } from 'src/core/services/spotify.service';
import { Album, AlbumDocument } from 'src/database/spotify/album.schema';
import { Artist, ArtistDocument } from 'src/database/spotify/artist.schema';
import { Genre, GenreDocument } from 'src/database/spotify/genre.schema';
import {
  Playlist,
  PlaylistDocument,
} from 'src/database/spotify/playlist.schema';
import { Track, TrackDocument } from 'src/database/spotify/track.schema';

@Injectable()
export class AlbumService {
  private readonly logger = new Logger(AlbumService.name);
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
    @InjectModel(Playlist.name)
    private playlistModel: Model<PlaylistDocument>,
  ) {}

  async getMostPopular({
    limit = 50,
    skip = 0,
  }: {
    limit?: number;
    skip?: number;
  }) {
    const [results, total] = await Promise.all([
      this.albumModel
        .find({ deletedAt: null })
        .sort({ playCount: -1 })
        .skip(skip)
        .limit(limit),
      this.albumModel.countDocuments({ deletedAt: null }),
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
}
