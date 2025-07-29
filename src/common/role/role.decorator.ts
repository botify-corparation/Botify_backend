import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const roles = (...roles: UserRole[]) => SetMetadata('role', roles);
