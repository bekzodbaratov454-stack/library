import { IsEnum } from 'class-validator';
import { UserRole } from 'src/models/users.schemas';

export class UpdateRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
