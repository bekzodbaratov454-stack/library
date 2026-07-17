import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsNumber()
  publishedYear: number;

  @IsString()
  description?: string;

  @IsString()
  genre?: string;

  @IsNumber()
  @Min(1)
  pages?: number;

  @IsString()
  language?: string;

  @IsNumber()
  @Min(0)
  availableCopies: number;

  @IsString()
  @IsOptional()
  coverImage?: string;
}