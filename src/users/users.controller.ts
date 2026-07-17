import { Controller, Get, Patch, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/models/users.schemas';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Patch('me')
  updateMe(@Request() req, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.id, dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.usersService.findAll(+page, +limit);
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.usersService.updateRole(id, dto.role);
  }

  @Patch(':id/block')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  block(@Param('id') id: string) {
    return this.usersService.block(id);
  }

  @Patch(':id/unblock')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  unblock(@Param('id') id: string) {
    return this.usersService.unblock(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
