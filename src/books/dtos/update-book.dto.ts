import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsNumber()
  @IsOptional()
  publishedYear?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  pages?: number;

  @IsString()
  @IsOptional()
  language?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  availableCopies?: number;
}