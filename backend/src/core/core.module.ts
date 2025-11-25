import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from 'src/core/controllers/auth.controller';
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
import { TrackController } from 'src/core/controllers/track.controller';
import { TrackService } from 'src/core/services/track.service';
import { AlbumController } from 'src/core/controllers/album.controller';
import { PlaylistController } from 'src/core/controllers/playlist.controller';
import { ArtistController } from 'src/core/controllers/artist.controller';
import { AlbumService } from 'src/core/services/album.service';
import { PlaylistService } from 'src/core/services/playlist.service';
import { ArtistService } from 'src/core/services/artist.service';
import { Playlist, PlaylistSchema } from 'src/database/spotify/playlist.schema';

@Module({
  imports: [
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
      {
        name: Playlist.name,
        schema: PlaylistSchema,
      },
    ]),
  ],
  controllers: [
    AuthController,
    AdminController,
    TrackController,
    AlbumController,
    PlaylistController,
    ArtistController,
  ],
  providers: [
    AuthService,
    SpotifyService,
    SpotifyAdminService,
    TrackService,
    AlbumService,
    PlaylistService,
    ArtistService,
  ],
})
export class CoreModule {}
