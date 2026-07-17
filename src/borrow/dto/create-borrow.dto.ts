import { IsString } from 'class-validator';

export class CreateBorrowDto {
  @IsString()
  bookId: string;
}