import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { BooksService } from "./books.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/models/users.schemas";
import { CreateBookDto } from "./dtos/create-book.dto";
import { UpdateBookDto } from "./dtos/update-book.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

@Controller('books')
export class BooksController {
    constructor(private readonly bookService: BooksService) {}

    @Get()
    findAll() {
        return this.bookService.findAll();
    }


    @Get(':id') 
    findById(@Param('id') id: string) {
        return this.bookService.findById(id);
    }


    @Post()
    @UseGuards( JwtAuthGuard , RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() payload: CreateBookDto) {
        return this.bookService.create(payload);
    }


    @Patch(':id')
    @UseGuards( JwtAuthGuard , RolesGuard )
    @Roles(UserRole.ADMIN)
    update(@Param('id') id: string, @Body() payload: UpdateBookDto) {
        return this.bookService.update(id , payload);
    }


    @Delete(':id')
    @UseGuards( JwtAuthGuard , RolesGuard )
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.bookService.remove(id)
    }


    @Post(':id/cover')
    @UseGuards( JwtAuthGuard , RolesGuard )
    @Roles(UserRole.ADMIN)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    uploadCover(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        return this.bookService.updateCover(id, file);
    }
    
    


}