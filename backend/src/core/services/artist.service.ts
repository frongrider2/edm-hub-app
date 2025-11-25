import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SpotifyService } from 'src/core/services/spotify.service';
import { Album, AlbumDocument } from 'src/database/spotify/album.schema';
import { Artist, ArtistDocument } from 'src/database/spotify/artist.schema';
import { Genre, GenreDocument } from 'src/database/spotify/genre.schema';
import { Track, TrackDocument } from 'src/database/spotify/track.schema';

@Injectable()
export class ArtistService {
  private readonly logger = new Logger(ArtistService.name);
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

  async getMostPopular({
    limit = 50,
    skip = 0,
  }: {
    limit?: number;
    skip?: number;
  }) {
    const [results, total] = await Promise.all([
      this.artistModel
        .find({ deletedAt: null })
        .sort({ playCount: -1 })
        .skip(skip)
        .limit(limit)
        .populate('genres'),
      this.artistModel.countDocuments({ deletedAt: null }),
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

  async getArtist(_id: string) {
    const artist = await this.artistModel
      .findOne({
        _id: new Types.ObjectId(_id),
      })
      .populate('genres');
    return artist;
  }
}
