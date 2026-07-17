import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DbMigrationService implements OnModuleInit {
  private readonly logger = new Logger(DbMigrationService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    await this.dropLegacyIndexes();
  }

  private async dropLegacyIndexes() {
    try {
      const usersCollection = this.connection.collection('users');
      const indexes = await usersCollection.indexes();

      for (const idx of indexes) {
        // telegramId_1 indexni o'chiramiz (sparse bo'lmagan)
        if (idx.name === 'telegramId_1') {
          await usersCollection.dropIndex('telegramId_1');
          this.logger.log('telegramId_1 index muvaffaqiyatli o\'chirildi');
        }
      }
    } catch (err: any) {
      this.logger.warn('Index cleanup xatosi (kritik emas):', err.message);
    }
  }
}
