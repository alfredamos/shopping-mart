import { PartialType } from '@nestjs/mapped-types';
import { CreateCartItemDto } from './create-cart-item.dto';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
}
