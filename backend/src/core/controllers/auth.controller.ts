import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Res,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserRequest } from 'src/core/auth/decorators/user.decolator';
import {
  IJWTpayload,
  LoginDto,
  RegisterDto,
  UserResponseDto,
} from 'src/core/dtos/auth.dto';
import { AuthGuard } from 'src/core/auth/guards/auth.guard';
import { AuthService } from 'src/core/auth/auth.service';
import { UserService } from 'src/database/user/user.service';
import { Response } from 'express';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: RegisterDto) {
    const { user, tokens } = await this.authService.registerUser(createUserDto);

    const userRes = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return {
      user: userRes,
      tokens,
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { user, tokens } = await this.authService.loginUser(loginDto);

    const userRes = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return {
      user: userRes,
      tokens,
    };
  }

  @Get('google-callback')
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      throw new BadRequestException('Code is required');
    }
    const { redirectUrl } = await this.authService.googleLogin(code);

    return res.redirect(redirectUrl);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@UserRequest() user: IJWTpayload) {
    const userFind = await this.userService.findById(user._id);

    const userRes = plainToInstance(UserResponseDto, userFind, {
      excludeExtraneousValues: true,
    });

    return userRes;
  }

  @Get('google-login')
  googleLogin(@Res() res: Response) {
    console.log('ok');
    const url = this.authService.getGoogleAuthUrl();
    res.redirect(url);
  }
}
