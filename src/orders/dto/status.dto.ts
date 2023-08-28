/* eslint-disable prettier/prettier */
import { Status } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class StatusDto {
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;
}
