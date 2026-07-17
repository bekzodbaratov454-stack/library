import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  author!: string;

  @Prop({ required: true })
  publishedYear!: number;

  @Prop({ required: true })
  description?: string;

  @Prop({ required: true })
  genre?: string;

  @Prop({ required: true })
  pages?: number;

  @Prop({ required: true })
  language?: string;

  @Prop({ default: 0 })
  availableCopies!: number;

  @Prop({ default: null })
  coverImage!: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);