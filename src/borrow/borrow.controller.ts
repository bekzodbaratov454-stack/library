import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from 'src/models/users.schemas';

@Controller('borrow')
@UseGuards(JwtAuthGuard)
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post()
  borrowBook(@Request() req, @Body() dto: CreateBorrowDto) {
    return this.borrowService.borrowBook(req.user.id, dto);
  }

  @Patch(':id/return')
  returnBook(@Request() req, @Param('id') id: string) {
    return this.borrowService.returnBook(id, req.user.id);
  }

  @Get('my')
  myBorrows(@Request() req) {
    return this.borrowService.myBorrows(req.user.id);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getStats() {
    return this.borrowService.getStats();
  }

  @Get('overdue')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findOverdue() {
    return this.borrowService.findOverdue();
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.borrowService.findAll(+page, +limit);
  }
}
