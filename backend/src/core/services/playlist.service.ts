import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import {
  AddTrackToPlaylistDto,
  CreatePlaylistDto,
  DeleteTrackFromPlaylistDto,
} from 'src/core/dtos/playlist.dto';
import { SpotifyService } from 'src/core/services/spotify.service';
import { slugify } from 'src/core/utils/index';
import { Album, AlbumDocument } from 'src/database/spotify/album.schema';
import { Artist, ArtistDocument } from 'src/database/spotify/artist.schema';
import { Genre, GenreDocument } from 'src/database/spotify/genre.schema';
import {
  Playlist,
  PlaylistDocument,
} from 'src/database/spotify/playlist.schema';
import { Track, TrackDocument } from 'src/database/spotify/track.schema';
import { UserService } from 'src/database/user/user.service';

@Injectable()
export class PlaylistService {
  private readonly logger = new Logger(PlaylistService.name);
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
    private readonly userService: UserService,
  ) {}

  async createPlaylist(userId: string, createPlaylistDto: CreatePlaylistDto) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const playlist = await this.playlistModel.create({
      ...createPlaylistDto,
      createdBy: user._id,
      slug: slugify(createPlaylistDto.name),
    });
    return {
      _id: playlist._id.toString(),
      name: playlist.name,
      description: playlist.description,
      slug: playlist.slug,
    };
  }

  async getMostPopular({
    limit = 50,
    skip = 0,
  }: {
    limit?: number;
    skip?: number;
  }) {
    const [results, total] = await Promise.all([
      this.playlistModel
        .find({ deletedAt: null })
        .sort({ playCount: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: 'createdBy', select: 'id name picture' }),
      this.playlistModel.countDocuments({ deletedAt: null }),
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

  async getUserPlaylists(
    userId: string,
    {
      limit = 50,
      skip = 0,
    }: {
      limit?: number;
      skip?: number;
    } = {},
  ) {
    const [results, total] = await Promise.all([
      this.playlistModel
        .find({ createdBy: userId, deletedAt: null })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: 'createdBy', select: 'id name picture' }),
      this.playlistModel.countDocuments({ createdBy: userId, deletedAt: null }),
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

  async getPlaylistBySlug(slug: string) {
    const playlist = await this.playlistModel
      .findOne({ slug })
      .populate({ path: 'createdBy', select: 'id name picture' })
      .populate('tracks');
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    return playlist;
  }

  async addPlaylistTrack(
    userId: string,
    addTrackToPlaylistDto: AddTrackToPlaylistDto,
  ) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const playlist = await this.playlistModel.findOne({
      _id: addTrackToPlaylistDto.playlistId,
      createdBy: userId,
    });
    if (!playlist) {
      throw new NotFoundException(
        'Playlist not found or you are not the owner',
      );
    }

    const trackListCheck = playlist.tracks.some(
      (track: any) => track.toString() === addTrackToPlaylistDto.trackId,
    );
    if (trackListCheck) {
      return playlist;
    }

    const track = await this.trackModel.findById(
      new Types.ObjectId(addTrackToPlaylistDto.trackId),
    );

    if (!track) {
      throw new NotFoundException('Track not found');
    }
    playlist.tracks.push(track);
    await playlist.save();
    return playlist;
  }

  async deletePlaylistTrack(
    userId: string,
    deleteTrackFromPlaylistDto: DeleteTrackFromPlaylistDto,
  ) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const playlist = await this.playlistModel.findOne({
      _id: deleteTrackFromPlaylistDto.playlistId,
      createdBy: userId,
    });
    if (!playlist) {
      throw new NotFoundException(
        'Playlist not found or you are not the owner',
      );
    }

    const trackIndex = playlist.tracks.findIndex(
      (track: any) => track.toString() === deleteTrackFromPlaylistDto.trackId,
    );
    if (trackIndex === -1) {
      return playlist;
    }

    const track = await this.trackModel.findById(
      new Types.ObjectId(deleteTrackFromPlaylistDto.trackId),
    );

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    playlist.tracks.splice(trackIndex, 1);
    await playlist.save();
    return playlist;
  }

  async getPlaylistTracksBySlug(
    slug: string,
    { limit = 10, skip = 0 }: { limit?: number; skip?: number } = {},
  ) {
    const playlist = await this.playlistModel
      .findOne({
        slug,
        deletedAt: null,
      })
      .select('tracks')
      .lean();
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    const trackIds: string[] = (playlist.tracks || []).map((t: any) =>
      t.toString(),
    );
    const total = trackIds.length;
    if (total === 0) {
      return { items: [], total, hasNext: false, limit, skip };
    }

    // Paginate first, fetch only tracks in this slice (scales better for large playlists)
    const pageIds = trackIds.slice(skip, skip + limit);

    // Query tracks in the slice, and populate references if needed
    const tracks = await this.trackModel
      .find({ _id: { $in: pageIds } })
      .populate('artistRefs')
      .populate('albumRef')
      .lean();

    // Map and preserve the playlist order
    const trackMap = new Map(
      tracks.map((track: any) => [track._id.toString(), track]),
    );
    const orderedTracks = pageIds.map((id) => trackMap.get(id)).filter(Boolean);

    const hasNext = skip + limit < total;

    return { items: orderedTracks, total, hasNext, limit, skip };
  }

  async softDeletePlaylist(userId, playlistId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const playlist = await this.playlistModel.findOneAndUpdate(
      { _id: playlistId, createdBy: userId },
      { deletedAt: new Date() },
      { new: true },
    );
    if (!playlist) {
      throw new NotFoundException(
        'Playlist not found or you are not the owner',
      );
    }
    return playlist;
  }
}
