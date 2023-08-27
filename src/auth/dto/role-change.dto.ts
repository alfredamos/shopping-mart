/* eslint-disable prettier/prettier */
import { Role } from '@prisma/client';

export class RoleChangeDto {
  email: string;
  role: Role;
}
