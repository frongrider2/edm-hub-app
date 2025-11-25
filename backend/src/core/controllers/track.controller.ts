import { Controller, Get, Param, Query } from '@nestjs/common';
import { TrackService } from 'src/core/services/track.service';
import { UserService } from 'src/database/user/user.service';

@Controller('/api/track')
export class TrackController {
  constructor(
    private readonly userService: UserService,
    private readonly trackService: TrackService,
  ) {}

  @Get('popular')
  getPopular(
    @Query('limit') limit: number = 10,
    @Query('skip') skip: number = 0,
  ) {
    return this.trackService.getMostPopular({
      limit,
      skip,
    });
  }

  @Get('random')
  getRandom(@Query('limit') limit: number = 10) {
    return this.trackService.getRandom({
      limit,
    });
  }

  @Get(':id')
  getTrack(@Param('id') id: string) {
    return this.trackService.getTrack(id);
  }

  @Get('artist/:id')
  getTrackByArtist(
    @Param('id') id: string,
    @Query('limit') limit: number = 10,
    @Query('skip') skip: number = 0,
  ) {
    return this.trackService.getTrackByArtist(id, { limit, skip });
  }

  @Get('playlist/:slug')
  getTrackByPlaylist(
    @Param('slug') slug: string,
    @Query('limit') limit: number = 10,
    @Query('skip') skip: number = 0,
  ) {
    return this.trackService.getTrackByPlaylist(slug, { limit, skip });
  }
}
