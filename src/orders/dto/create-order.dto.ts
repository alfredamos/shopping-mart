import { CartItem } from '@prisma/client';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateOrderDto {
  @IsPositive()
  @IsNumber()
  price: number;
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;
  //@IsOptional()
  @IsNotEmpty()
  //@IsArray()
  cartItems: CartItem[];
}
