import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/models/users.schemas';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);