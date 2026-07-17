import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from '@nestjs/cache-manager';

import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Book, BookDocument } from "src/models/books.schema";
import { CreateBookDto } from "./dtos/create-book.dto";
import { UpdateBookDto } from "./dtos/update-book.dto";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";

@Injectable()
export class BooksService {
    constructor(
        @InjectModel(Book.name) private bookModel: Model<BookDocument>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly cloudinaryService: CloudinaryService,
    ) {}


    async findAll() {
        const cache = await this.cacheManager.get('all_books');
        if(cache) return cache

        const books = await this.bookModel.find();
        await this.cacheManager.set('all_books' , books , 6000);
        return books
    }


    async findById(id: string) {
        const book = await this.bookModel.findById(id);
        if(!book) {
            throw new NotFoundException('Kitob topilmadi')
        }
        return book;
    }


    
    async create(payload: CreateBookDto) {
        const book = await this.bookModel.create(payload);

        await this.cacheManager.del('all_books');

        return book
    }

    
    async update(id: string , payload: UpdateBookDto) {
        const book = await this.bookModel.findByIdAndUpdate(id, payload, { new: true });
        if(!book) throw new NotFoundException("Kitob topilmadi");

        await this.cacheManager.del('all_books');
        return book;
    }


    async remove(id: string) {
        const book = await this.bookModel.findByIdAndDelete(id);
        if(!book) throw new NotFoundException("Kitob topilmadi");

        await this.cacheManager.del('all_books');
    }


    async updateCover(id: string, file: Express.Multer.File) {
        const uploaded = await this.cloudinaryService.uploadFile(file, 'books');

        const book = await this.bookModel.findByIdAndUpdate(
            id,
            { coverImage: uploaded.secure_url },
            { new: true },
        );

        if (!book) throw new NotFoundException('Kitob topilmadi');
        await this.cacheManager.del('all_books');

        return book;
    }
      

    

}