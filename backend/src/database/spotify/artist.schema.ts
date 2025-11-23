import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Genre } from './genre.schema';

export type ArtistDocument = HydratedDocument<Artist>;

@Schema({ _id: false })
export class ExternalUrls {
  @Prop({ type: String })
  spotify: string;
}

@Schema({ _id: false })
export class Followers {
  @Prop({ type: String, default: null })
  href: string | null;

  @Prop({ type: Number })
  total: number;
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

@Schema({
  collection: 'artists',
  timestamps: true,
})
export class Artist {
  @Prop({ type: String, required: true, unique: true, index: true })
  id: string;

  @Prop({ type: ExternalUrls })
  external_urls: ExternalUrls;

  @Prop({ type: Followers })
  followers: Followers;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Genre' }],
    default: [],
  })
  genres: Genre[];

  @Prop({ type: String })
  href: string;

  @Prop({ type: [Image], default: [] })
  images: Image[];

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number })
  popularity: number;

  @Prop({ type: String })
  type: string;

  @Prop({ type: String })
  uri: string;

  @Prop({ type: Date })
  deletedAt?: Date;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
