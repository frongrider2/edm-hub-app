import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Artist } from './artist.schema';
import { Album } from './album.schema';

export type TrackDocument = HydratedDocument<Track>;

@Schema({ _id: false })
export class ExternalUrls {
  @Prop({ type: String })
  spotify: string;
}

@Schema({ _id: false })
export class TrackArtist {
  @Prop({ type: ExternalUrls })
  external_urls: ExternalUrls;

  @Prop({ type: String })
  href: string;

  @Prop({ type: String })
  id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  type: string;

  @Prop({ type: String })
  uri: string;
}

@Schema({ _id: false })
export class LinkedFrom {
  @Prop({ type: ExternalUrls })
  external_urls: ExternalUrls;

  @Prop({ type: String })
  href: string;

  @Prop({ type: String })
  id: string;

  @Prop({ type: String })
  type: string;

  @Prop({ type: String })
  uri: string;
}

@Schema({ _id: false })
export class Restrictions {
  @Prop({ type: String })
  reason: string;
}

@Schema({
  collection: 'tracks',
  timestamps: true,
})
export class Track {
  @Prop({ type: String, required: true, unique: true, index: true })
  id: string;

  @Prop({ type: [TrackArtist], default: [] })
  artists: TrackArtist[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Artist' }],
    default: [],
  })
  artistRefs: Artist[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Album' })
  albumRef: Album;

  @Prop({ type: [String], default: [] })
  available_markets: string[];

  @Prop({ type: Number })
  disc_number: number;

  @Prop({ type: Number })
  duration_ms: number;

  @Prop({ type: Number, default: 0 })
  playCount: number;

  @Prop({ type: Boolean })
  explicit: boolean;

  @Prop({ type: ExternalUrls })
  external_urls: ExternalUrls;

  @Prop({ type: String })
  href: string;

  @Prop({ type: Boolean })
  is_playable: boolean;

  @Prop({ type: LinkedFrom })
  linked_from: LinkedFrom;

  @Prop({ type: Restrictions })
  restrictions: Restrictions;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  preview_url: string;

  @Prop({ type: Number })
  track_number: number;

  @Prop({ type: String })
  type: string;

  @Prop({ type: String })
  uri: string;

  @Prop({ type: Boolean })
  is_local: boolean;

  @Prop({ type: Date })
  deletedAt?: Date;
}

export const TrackSchema = SchemaFactory.createForClass(Track);

// Add indexes for better query performance
TrackSchema.index({ playCount: -1 }); // For sorting by popularity
TrackSchema.index({ artistRefs: 1 }); // For artist's tracks queries
TrackSchema.index({ albumRef: 1 }); // For album's tracks queries
