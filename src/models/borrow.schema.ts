import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BorrowDocument = Borrow & Document;

@Schema({ timestamps: true })
export class Borrow {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  bookId!: Types.ObjectId;

  @Prop({ default: Date.now })
  borrowedAt!: Date;

  @Prop({ default: null })
  returnedAt!: Date;

  @Prop({ required: true })
  dueDate!: Date;

  @Prop({ default: false })
  isOverdue!: boolean;
}

export const BorrowSchema = SchemaFactory.createForClass(Borrow);
