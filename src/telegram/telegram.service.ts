import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot = require('node-telegram-bot-api');
import { Message } from 'node-telegram-bot-api';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book , BookDocument  } from 'src/models/books.schema';
import { Borrow , BorrowDocument } from 'src/models/borrow.schema';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;

  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Borrow.name) private borrowModel: Model<BorrowDocument>,
  ) {}

  onModuleInit() {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    // Token yo'q bo'lsa botni ishga tushirmaymiz
    if (!token) {
      console.warn('[TelegramService] TELEGRAM_BOT_TOKEN topilmadi, bot ishlamaydi');
      return;
    }

    this.bot = new TelegramBot(token, {
      polling: {
        interval: 3000,
        autoStart: true,
        params: { timeout: 10 },
      },
    });

    this.bot.on('polling_error', (err) => {
      console.error('[TelegramBot] polling_error:', err.message);
    });

    this.bot.onText(/\/start/, (msg) => this.handleStart(msg));
    this.bot.onText(/\/books/, (msg) => this.handleBooks(msg));
    this.bot.onText(/\/mybooks (.+)/, (msg, match) => {
      if (!match) return;
      this.handleMyBooks(msg, match);
    });
  }

  private async handleStart(msg: Message) {
    const name = msg.from?.first_name ?? 'Foydalanuvchi';
    await this.bot.sendMessage(
      msg.chat.id,
      `Salom ${name}! 📚\n\n` +
      `Smart Library botiga xush kelibsiz!\n\n` +
      `Buyruqlar:\n` +
      `/books - Barcha kitoblar\n` +
      `/mybooks <userId> - Mening kitoblarim`,
    );
  }

  private async handleBooks(msg: Message) {
    const books = await this.bookModel.find().limit(10);

    if (books.length === 0) {
      await this.bot.sendMessage(msg.chat.id, 'Kitoblar topilmadi');
      return;
    }

    const text = books
      .map((b, i) =>
        `${i + 1}. 📖 ${b.title}\n` +
        `   👤 ${b.author}\n` +
        `   📦 Nusxalar: ${b.availableCopies}`,
      )
      .join('\n\n');

    await this.bot.sendMessage(msg.chat.id, text);
  }

  private async handleMyBooks(msg: Message, match: RegExpExecArray) {
    const userId = match[1];

    const borrows = await this.borrowModel
      .find({ userId })
      .populate('bookId', 'title author');

    if (borrows.length === 0) {
      await this.bot.sendMessage(msg.chat.id, 'Siz hech qanday kitob olmadingiz');
      return;
    }

    const text = borrows
      .map((b: any, i) => {
        const status = b.returnedAt ? '✅ Qaytarilgan' : '📖 Jarayonda';
        return (
          `${i + 1}. ${b.bookId.title}\n` +
          `   👤 ${b.bookId.author}\n` +
          `   ${status}`
        );
      })
      .join('\n\n');

    await this.bot.sendMessage(msg.chat.id, text);
  }
}