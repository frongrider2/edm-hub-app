import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/user.schema';
import { Track, TrackDocument } from './track.schema';

export type PlaylistDocument = HydratedDocument<Playlist>;

@Schema({
  collection: 'playlists',
  timestamps: true,
})
export class Playlist {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  createdBy: User;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Track' }],
    default: [],
  })
  tracks: TrackDocument[];

  @Prop({ type: String })
  accentColor?: string;

  @Prop({ type: Number, default: 0 })
  playCount: number;

  @Prop({ type: Date, default: null })
  lastPlayedAt: Date;

  @Prop({ type: Boolean, default: true })
  isPublic: boolean;

  @Prop({ type: String, unique: true, sparse: true, index: true })
  slug: string;

  @Prop({ type: String, default: null })
  coverImageUrl: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);

// Add composite indexes for better query performance
PlaylistSchema.index({ createdBy: 1, createdAt: -1 });
PlaylistSchema.index({ createdBy: 1, isFavorite: 1 });
PlaylistSchema.index({ isPublic: 1, createdAt: -1 });
PlaylistSchema.index({ tags: 1 });
PlaylistSchema.index({ slug: 1 }, { unique: true, sparse: true });
