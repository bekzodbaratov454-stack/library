import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramService } from './telegram.service';
import { Book , BookSchema } from 'src/models/books.schema';
import { Borrow , BorrowSchema } from 'src/models/borrow.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Borrow.name, schema: BorrowSchema },
    ]),
  ],
  providers: [TelegramService],
})
export class TelegramModule {}