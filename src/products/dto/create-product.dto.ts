import {
  IsNotEmpty,
  IsString,
  IsPositive,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsPositive()
  @IsNumber()
  price: number;
  @IsOptional()
  rating?: number;
  @IsNotEmpty()
  @IsString()
  brand: string;
  @IsPositive()
  @IsNumber()
  quantity: number;
  @IsOptional()
  description?: string;
  @IsOptional()
  productImage?: string;
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
