import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { AuthModule } from './auth/auth.module';
import { BorrowModule } from './borrow/borrow.module';
import { UsersModule } from './users/user.module';
import { BooksModule } from './books/books.module';
import { TelegramModule } from './telegram/telegram.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AppController } from './app.controller';
import { DbMigrationService } from './db-migration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

  

   MongooseModule.forRootAsync({
      useFactory: () => {
        const uri = process.env.MONGO_URL || process.env.MONGODB_URI;
        if (!uri) {
          throw new Error(
            '[MongooseModule] MONGO_URL (yoki MONGODB_URI) topilmadi. ' +
              '.env faylini tekshiring — aks holda ilova bazaga ulanmaydi va barcha ma\'lumotlar bo\'sh ko\'rinadi.',
          );
        }
        return { uri };
      },
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useFactory: (config: ConfigService): any => {
        const redisHost = config.get<string>('REDIS_HOST');
        if (redisHost) {
          return {
            store: redisStore,
            host: redisHost,
            port: config.get<number>('REDIS_PORT') || 6379,
            ttl: 60,
          };
        }
        // Redis yo'q bo'lsa memory cache
        return { ttl: 60 };
      },
    }),

    AuthModule,
    BorrowModule,
    UsersModule,
    BooksModule,
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [DbMigrationService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(LoggerMiddleware)
    .forRoutes('*');
  }
}
