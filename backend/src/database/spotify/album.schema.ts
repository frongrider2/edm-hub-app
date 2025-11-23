import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Artist } from './artist.schema';

export type AlbumDocument = HydratedDocument<Album>;

@Schema({ _id: false })
export class ExternalUrls {
  @Prop({ type: String })
  spotify: string;
}

@Schema({ _id: false })
export class Image {
  @Prop({ type: String })
  url: string;

  @Prop({ type: Number })
  height: number;

  @Prop({ type: Number })
  width: number;
}

@Schema({ _id: false })
export class Restrictions {
  @Prop({ type: String })
  reason: string;
}

@Schema({ _id: false })
export class AlbumArtist {
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

@Schema({
  collection: 'albums',
  timestamps: true,
})
export class Album {
  @Prop({ type: String, required: true, unique: true, index: true })
  id: string;

  @Prop({ type: String })
  album_type: string;

  @Prop({ type: Number })
  total_tracks: number;

  @Prop({ type: [String], default: [] })
  available_markets: string[];

  @Prop({ type: ExternalUrls })
  external_urls: ExternalUrls;

  @Prop({ type: String })
  href: string;

  @Prop({ type: [Image], default: [] })
  images: Image[];

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  release_date: string;

  @Prop({ type: String })
  release_date_precision: string;

  @Prop({ type: Restrictions })
  restrictions: Restrictions;

  @Prop({ type: String })
  type: string;

  @Prop({ type: String })
  uri: string;

  @Prop({ type: [AlbumArtist], default: [] })
  artists: AlbumArtist[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Artist' }],
    default: [],
  })
  artistRefs: Artist[];

  @Prop({ type: String })
  album_group: string;

  @Prop({ type: Date })
  deletedAt?: Date;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
