import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GenreDocument = HydratedDocument<Genre>;

@Schema({
  collection: 'genres',
  timestamps: true,
})
export class Genre {
  @Prop({ type: String, required: true, unique: true, index: true })
  name: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String, unique: true, sparse: true })
  slug?: string;

  @Prop({ type: Date })
  deletedAt?: Date;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
