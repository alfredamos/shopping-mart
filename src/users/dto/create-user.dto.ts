/* eslint-disable prettier/prettier */
import { Gender, Role } from '@prisma/client';

export class CreateUserDto { 
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role?: Role;
  gender: Gender;
}
