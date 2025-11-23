import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from 'src/core/controllers/auth.controller';
import { UserController } from 'src/core/controllers/user.controller';
import { AuthService } from 'src/core/auth/auth.service';
import { ConfigurationModule } from 'src/database/config/configuration.module';
import { UsersModule } from 'src/database/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from 'src/core/controllers/admin.controller';
import { SpotifyService } from 'src/core/services/spotify.service';
import { SpotifyAdminService } from 'src/core/services/spotify-admin.service';
import { Genre, GenreSchema } from 'src/database/spotify/genre.schema';
import { Artist, ArtistSchema } from 'src/database/spotify/artist.schema';
import { Album, AlbumSchema } from 'src/database/spotify/album.schema';
import { Track, TrackSchema } from 'src/database/spotify/track.schema';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const JWT_SECRET = configService.get('JWT_SECRET') as string;
        if (!JWT_SECRET) {
          throw new Error('JWT_SECRET is not defined');
        }
        return {
          secret: JWT_SECRET,
        };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          // milliseconds
          ttl: 60 * 60 * 1000, // 1 hr
          limit: 20,
        },
      ],
    }),
    UsersModule,
    ConfigurationModule,
    MongooseModule.forFeature([
      { name: Genre.name, schema: GenreSchema },
      {
        name: Artist.name,
        schema: ArtistSchema,
      },
      {
        name: Album.name,
        schema: AlbumSchema,
      },
      {
        name: Track.name,
        schema: TrackSchema,
      },
    ]),
  ],
  controllers: [UserController, AuthController, AdminController],
  providers: [AuthService, SpotifyService, SpotifyAdminService],
})
export class CoreModule {}
