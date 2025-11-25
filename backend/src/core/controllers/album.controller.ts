import { Controller, Get, Query } from '@nestjs/common';
import { AlbumService } from 'src/core/services/album.service';
import { UserService } from 'src/database/user/user.service';

@Controller('/api/album')
export class AlbumController {
  constructor(
    private readonly userService: UserService,
    private readonly albumService: AlbumService,
  ) {}

  @Get('popular')
  getPopular(
    @Query('limit') limit: number = 10,
    @Query('skip') skip: number = 0,
  ) {
    return this.albumService.getMostPopular({
      limit,
      skip,
    });
  }
}
