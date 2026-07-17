import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { Borrow, BorrowSchema } from 'src/models/borrow.schema';
import { Book, BookSchema } from 'src/models/books.schema';
import { User, UserSchema } from 'src/models/users.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Borrow.name, schema: BorrowSchema },
      { name: Book.name,   schema: BookSchema   },
      { name: User.name,   schema: UserSchema   },
    ]),
  ],
  controllers: [BorrowController],
  providers: [BorrowService],
})
export class BorrowModule {}