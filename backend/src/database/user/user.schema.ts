import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema()
export class User {
  @Prop({ type: String, required: false, default: null })
  googleId: string;

  @Prop({ type: String, required: false, default: '' })
  name: string;

  @Prop({ type: String, required: false, default: '' })
  picture: string;

  @Prop({ type: String, required: false, default: null })
  email: string;

  @Prop({ type: String, required: false, default: null })
  password: string;

  @Prop({ type: Boolean, required: true, default: false })
  isEmailVerified: boolean;

  @Prop({ type: Boolean, required: true, default: true })
  isEnabled: boolean;

  @Prop({ default: UserRole.USER })
  role: UserRole;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Playlist' }],
    default: [],
  })
  favoritePlaylists: MongooseSchema.Types.ObjectId[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Track' }],
    default: [],
  })
  favoriteTracks: MongooseSchema.Types.ObjectId[];

  @Prop({ type: Date })
  deletedAt?: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add indexes for favorite queries
UserSchema.index({ favoritePlaylists: 1 });
UserSchema.index({ favoriteTracks: 1 });
