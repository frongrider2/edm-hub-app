import { Controller, Get, Param, Query } from '@nestjs/common';
import { ArtistService } from 'src/core/services/artist.service';
import { UserService } from 'src/database/user/user.service';

@Controller('/api/artist')
export class ArtistController {
  constructor(
    private readonly userService: UserService,
    private readonly artistService: ArtistService,
  ) {}

  @Get('popular')
  getPopular(
    @Query('limit') limit: number = 10,
    @Query('skip') skip: number = 0,
  ) {
    return this.artistService.getMostPopular({
      limit,
      skip,
    });
  }

  @Get(':id')
  getArtist(@Param('id') id: string) {
    return this.artistService.getArtist(id);
  }
}
