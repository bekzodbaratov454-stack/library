import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  fullName?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(30)
  password?: string;
}