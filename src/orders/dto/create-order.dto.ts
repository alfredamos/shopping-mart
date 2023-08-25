import { CartItem } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  items: number;
  @IsOptional()
  total: number;
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;
  @IsNotEmpty()
  cartItems: CartItem[];
}
