import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/models/users.schemas";
import { CreateUserDto } from "./dto/create.user.dto";
import { UpdateUserDto } from "./dto/update.user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument> ,
    ) {}


  async create(payload: CreateUserDto) {
    const existing = await this.userModel.findOne({ email: payload.email });
    if (existing) {
      throw new BadRequestException('Bu email allaqachon mavjud');
    }
    return this.userModel.create(payload);
  }

    async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }


  async findById(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new NotFoundException('User topilmadi');
    }
    return user;
  }


    async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.userModel.find().select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
      this.userModel.countDocuments(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

    async update(id: string, dto: UpdateUserDto) {
        if (dto.password) {
            dto.password = await bcrypt.hash(dto.password, 10);
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .select('-password');
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async updateRole(id: string, role: string) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { role }, { new: true })
      .select('-password');
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async block(id: string) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .select('-password');
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async unblock(id: string) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { isActive: true }, { new: true })
      .select('-password');
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
  }
}