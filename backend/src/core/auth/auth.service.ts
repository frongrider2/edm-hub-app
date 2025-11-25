import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import {
  IJWTpayload,
  LoginDto,
  RegisterDto,
  UserResponseDto,
} from 'src/core/dtos/auth.dto';
import { User, UserDocument } from 'src/database/user/user.schema';
import { UserService } from 'src/database/user/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  refresh_token?: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleAuthUrl =
    'https://accounts.google.com/o/oauth2/v2/auth';
  private readonly googleClientId: string;
  private readonly googleClientSecret: string;
  private readonly googleCallbackUrl: string;
  private readonly frontendUrl: string;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.googleClientId = this.configService.get<string>('OAUTH_CLIENT') || '';
    this.googleClientSecret =
      this.configService.get<string>('OAUTH_SECRET') || '';
    this.googleCallbackUrl =
      this.configService.get<string>('OAUTH_CALLBACK_URL') || '';
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || '';
  }

  async registerUser(dto: RegisterDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const newUser = await this.userService.createRegisterUser(dto);

    const tokens = this.generateTokens(newUser);

    return {
      user: newUser,
      tokens,
    };
  }

  async getGoogleTokens(code: string): Promise<GoogleTokenResponse> {
    const url = 'https://oauth2.googleapis.com/token';

    const body = new URLSearchParams({
      code,
      client_id: this.googleClientId,
      client_secret: this.googleClientSecret,
      redirect_uri: this.googleCallbackUrl,
      grant_type: 'authorization_code',
    });

    try {
      const response = await axios.post<GoogleTokenResponse>(
        url,
        body.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error fetching Google tokens', error);
      throw new HttpException(
        'Failed to get Google tokens',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const url = 'https://openidconnect.googleapis.com/v1/userinfo';
    try {
      const response = await axios.get<GoogleUserInfo>(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching Google user info', error);
      throw new HttpException(
        'Failed to get Google user info',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async loginUser(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new HttpException(
        'Email or password is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        'Email or password is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const tokens = this.generateTokens(user);

    return {
      user,
      tokens,
    };
  }

  async googleLogin(code: string) {
    const tokens = await this.getGoogleTokens(code);
    const userInfo = await this.getGoogleUserInfo(tokens.access_token);
    const user = await this.validateOrCreateGoogleUser(userInfo);

    const jwtToken = this.generateTokens(user);

    return {
      user,
      tokens,
      redirectUrl: `${this.frontendUrl}/google?access=${jwtToken.accessToken}&refresh=${jwtToken.refreshToken}`,
    };
  }

  async validateOrCreateGoogleUser(
    googleProfile: GoogleUserInfo,
  ): Promise<UserDocument> {
    let user = await this.userService.findByGoogleId(googleProfile.sub);

    if (!user && googleProfile.email) {
      user = await this.userService.findByEmail(googleProfile.email);
      if (user) {
        user.googleId = googleProfile.sub;
        user.name = user.name ?? googleProfile.name;
        user.picture = user.picture ?? googleProfile.picture;
        await this.userService.save(user);
      }
    }

    if (!user) {
      user = await this.userService.createGoogleUser({
        email: googleProfile.email || null,
        googleId: googleProfile.sub,
        name: googleProfile.name || null,
        picture: googleProfile.picture || null,
      });
    }

    return user;
  }

  generateTokens(user: UserDocument) {
    const payload = {
      email: user.email,
      _id: user._id.toString(),
      role: user.role,
      name: user.name,
      googleId: user.googleId,
    } as IJWTpayload;

    const accessToken = this.jwtService.sign(payload, { expiresIn: '24h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  // localStrategy
  verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify<IJWTpayload>(token);
      return payload;
    } catch (error) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }
  }

  getGoogleAuthUrl() {
    return `${this.googleAuthUrl}?client_id=${this.googleClientId}&redirect_uri=${this.googleCallbackUrl}&response_type=code&scope=email profile`;
  }
}
