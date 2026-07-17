import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Borrow, BorrowDocument } from 'src/models/borrow.schema';
import { Book, BookDocument } from 'src/models/books.schema';
import { User, UserDocument } from 'src/models/users.schemas';
import { CreateBorrowDto } from './dto/create-borrow.dto';

const DUE_DAYS = 14;      // Qaytarish muddati (kun)
const MAX_BORROWS = 3;    // Bir user bitta kitobni max necha marta olishi mumkin

@Injectable()
export class BorrowService {
  constructor(
    @InjectModel(Borrow.name) private borrowModel: Model<BorrowDocument>,
    @InjectModel(Book.name)   private bookModel:   Model<BookDocument>,
    @InjectModel(User.name)   private userModel:   Model<UserDocument>,
  ) {}

  async borrowBook(userId: string, dto: CreateBorrowDto) {
    const book = await this.bookModel.findById(dto.bookId);
    if (!book) throw new NotFoundException('Kitob topilmadi');
    if (book.availableCopies <= 0) {
      throw new BadRequestException('Kitobning mavjud nusxasi yuq');
    }

    // Max 3 marta cheklash — faqat hozir qaytarilmagan bo'lsa
    const activeBorrow = await this.borrowModel.findOne({
      userId,
      bookId: dto.bookId,
      returnedAt: null,
    });
    if (activeBorrow) {
      throw new BadRequestException('Siz bu kitobni allaqachon olgansinz, avval qaytaring');
    }

    const totalBorrows = await this.borrowModel.countDocuments({
      userId,
      bookId: dto.bookId,
    });
    if (totalBorrows >= MAX_BORROWS) {
      throw new BadRequestException(`Bu kitobni maksimal ${MAX_BORROWS} marta olish mumkin`);
    }

    book.availableCopies -= 1;
    await book.save();

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + DUE_DAYS);

    return this.borrowModel.create({
      userId,
      bookId: dto.bookId,
      borrowedAt: new Date(),
      dueDate,
    });
  }

  async returnBook(borrowId: string, userId: string) {
    const borrow = await this.borrowModel.findById(borrowId);
    if (!borrow) throw new NotFoundException('Ijara yozuvi topilmadi');
    if (borrow.userId.toString() !== userId) {
      throw new BadRequestException('Bu sizning ijarangiz emas');
    }
    if (borrow.returnedAt) {
      throw new BadRequestException('Kitob allaqachon qaytarilgan');
    }

    await this.bookModel.findByIdAndUpdate(borrow.bookId, {
      $inc: { availableCopies: 1 },
    });

    borrow.returnedAt = new Date();
    await borrow.save();

    return borrow;
  }

  async myBorrows(userId: string) {
    return this.borrowModel
      .find({ userId })
      .populate('bookId', 'title author coverImage')
      .sort({ borrowedAt: -1 });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.borrowModel
        .find()
        .populate('userId', 'fullName email')
        .populate('bookId', 'title author')
        .sort({ borrowedAt: -1 })
        .skip(skip)
        .limit(limit),
      this.borrowModel.countDocuments(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // Admin statistika
  async getStats() {
    const [
      totalBooks,
      totalUsers,
      totalBorrows,
      activeBorrows,
      overdueBorrows,
    ] = await Promise.all([
      this.bookModel.countDocuments(),
      this.userModel.countDocuments(),
      this.borrowModel.countDocuments(),
      this.borrowModel.countDocuments({ returnedAt: null }),
      this.borrowModel.countDocuments({
        returnedAt: null,
        dueDate: { $lt: new Date() },
      }),
    ]);

    const availableBooks = await this.bookModel.aggregate([
      { $group: { _id: null, total: { $sum: '$availableCopies' } } },
    ]);

    return {
      totalBooks,
      totalUsers,
      totalBorrows,
      activeBorrows,
      overdueBorrows,
      availableCopies: availableBooks[0]?.total ?? 0,
    };
  }

  // Muddati o'tgan borrowlarni topish (cron yoki manual)
  async findOverdue() {
    return this.borrowModel
      .find({ returnedAt: null, dueDate: { $lt: new Date() } })
      .populate('userId', 'fullName email')
      .populate('bookId', 'title author');
  }
}
