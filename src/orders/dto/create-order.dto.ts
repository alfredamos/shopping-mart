import { CartItem, Status } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  items: number;
  @IsOptional()
  total: number;
  @IsOptional()
  status?: Status;
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;
  @IsNotEmpty()
  cartItems: CartItem[];
}
