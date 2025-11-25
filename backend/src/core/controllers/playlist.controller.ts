import {
  Controller,
  Get,
  Query,
  UseGuards,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { UserRequest } from 'src/core/auth/decorators/user.decolator';
import { AuthGuard } from 'src/core/auth/guards/auth.guard';
import { IJWTpayload } from 'src/core/dtos/auth.dto';
import {
  AddTrackToPlaylistDto,
  CreatePlaylistDto,
  DeleteTrackFromPlaylistDto,
} from 'src/core/dtos/playlist.dto';
import { PlaylistService } from 'src/core/services/playlist.service';
import { UserService } from 'src/database/user/user.service';

@Controller('/api/playlist')
export class PlaylistController {
  constructor(
    private readonly userService: UserService,
    private readonly playlistService: PlaylistService,
  ) {}

  @Get('popular')
  getPopular(
    @Query('limit') limit: number = 10,
    @Query('skip') skip: number = 0,
  ) {
    return this.playlistService.getMostPopular({
      limit,
      skip,
    });
  }

  @UseGuards(AuthGuard)
  @Post('create')
  createPlaylist(
    @Body() createPlaylistDto: CreatePlaylistDto,
    @UserRequest() user: IJWTpayload,
  ) {
    return this.playlistService.createPlaylist(user._id, createPlaylistDto);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  getUserPlaylists(
    @UserRequest() user: IJWTpayload,
    @Query('limit') limit: number = 10,
    @Query('skip') skip: number = 0,
  ) {
    return this.playlistService.getUserPlaylists(user._id, { limit, skip });
  }

  @UseGuards(AuthGuard)
  @Post('add')
  getPlaylist(
    @UserRequest() user: IJWTpayload,
    @Body() addTrackToPlaylistDto: AddTrackToPlaylistDto,
  ) {
    return this.playlistService.addPlaylistTrack(
      user._id,
      addTrackToPlaylistDto,
    );
  }

  @UseGuards(AuthGuard)
  @Post('delete')
  deletePlaylistTrack(
    @UserRequest() user: IJWTpayload,
    @Body() deleteTrackFromPlaylistDto: DeleteTrackFromPlaylistDto,
  ) {
    return this.playlistService.deletePlaylistTrack(
      user._id,
      deleteTrackFromPlaylistDto,
    );
  }

  @Get(':slug')
  getPlaylistBySlug(@Param('slug') slug: string) {
    console.log({ slug });
    return this.playlistService.getPlaylistBySlug(slug);
  }

  @UseGuards(AuthGuard)
  @Delete(':playlistId')
  deletePlaylist(
    @UserRequest() user: IJWTpayload,
    @Param('playlistId') playlistId: string,
  ) {
    return this.playlistService.softDeletePlaylist(user._id, playlistId);
  }
}
