import { IsString, IsEmail, MinLength, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from 'src/models/users.schemas';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
