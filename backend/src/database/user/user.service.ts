import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { RegisterDto } from 'src/core/dtos/auth.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async createRegisterUser(dto: RegisterDto) {
    const saltRounds = +(
      this.configService.get<number>('BCRYPT_SALT_ROUNDS') || '10'
    );
    if (!saltRounds) {
      throw new HttpException(
        'BCRYPT_SALT_ROUNDS is not defined in environment variables',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    return this.userModel.create({
      email: dto.email,
      password: hashedPassword,
    });
  }

  async createGoogleUser(dto: {
    email: string | null;
    googleId: string;
    name: string | null;
    picture: string | null;
  }) {
    return this.userModel.create({
      email: dto.email,
      googleId: dto.googleId,
      name: dto.name,
      picture: dto.picture,
    });
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      return null;
    }
  }

  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    try {
      return await this.userModel.findOne({ googleId }).exec();
    } catch (error) {
      return null;
    }
  }

  async findById(id: string): Promise<UserDocument | null> {
    try {
      return await this.userModel.findById(id).exec();
    } catch (error) {
      return null;
    }
  }

  async save(user: UserDocument): Promise<UserDocument> {
    return await user.save();
  }

  getAll() {
    return this.userModel.find().exec();
  }
}
