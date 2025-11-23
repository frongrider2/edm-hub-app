import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/core/auth/guards/admin.guard';
import { AuthGuard } from 'src/core/auth/guards/auth.guard';
import { SpotifyAdminService } from 'src/core/services/spotify-admin.service';
import { SpotifyService } from 'src/core/services/spotify.service';

@UseGuards(AuthGuard, AdminGuard)
@Controller('/api/admin')
export class AdminController {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly spotifyAdminService: SpotifyAdminService,
  ) {}

  @Get('spotify/artist/:artistId')
  async getArtist(@Param('artistId') artistId: string) {
    return this.spotifyService.getArtist(artistId);
  }

  @Post('spotify/sync')
  syncArtists(@Body() body: { artistIds: string[] }) {
    return this.spotifyAdminService.syncArtists(body.artistIds);
  }
}
