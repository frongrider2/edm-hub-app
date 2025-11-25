import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePlaylistDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class AddTrackToPlaylistDto {
  @IsNotEmpty()
  @IsString()
  playlistId: string;

  @IsNotEmpty()
  @IsString()
  trackId: string;
}

export class DeleteTrackFromPlaylistDto {
  @IsNotEmpty()
  @IsString()
  playlistId: string;

  @IsNotEmpty()
  @IsString()
  trackId: string;
}
