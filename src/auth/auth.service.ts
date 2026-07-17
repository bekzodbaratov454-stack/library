import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from 'src/models/users.schemas';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      await this.usersService.create({
        fullName: dto.fullName,
        email: dto.email,
        password: hashedPassword,
        role: UserRole.USER,
      });
    } catch (err: any) {
      console.error('[Register] User yaratishda xato:', err?.message || err);
      if (err?.code === 11000) {
        throw new BadRequestException('Bu email allaqachon ro\'yxatdan o\'tgan');
      }
      throw err;
    }

    return { message: 'Ro\'yxatdan o\'tdingiz! Endi kirish mumkin.' };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Email yoki parol xato');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Email yoki parol xato');

    const payload = { id: user._id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
