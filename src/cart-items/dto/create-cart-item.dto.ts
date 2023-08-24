import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  productId: string;
  @IsOptional()
  orderId: string;
  @IsPositive()
  @IsNumber()
  price: number;
  @IsPositive()
  @IsNumber()
  quantity: number;
}
