import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartItemsService {
  constructor(private prisma: PrismaService) {}

  async create(createCartItemDto: CreateCartItemDto) {
    //----> Create an cartItem.
    const cartItem = await this.prisma.cartItem.create({
      data: { ...createCartItemDto },
    });

    //----> Send back response.
    return cartItem;
  }

  async findAll() {
    //----> Retrieve all categories.
    const allCategories = await this.prisma.cartItem.findMany({});

    //----> Check for existence of products.
    if (!allCategories || allCategories.length === 0) {
      throw new NotFoundException('Categories are not found in the database!');
    }

    //----> Send back the response.
    return allCategories;
  }

  async findOne(id: string) {
    //----> Retrieve the cartItem.
    const cartItem = await this.prisma.cartItem.findUnique({ where: { id } });

    //----> Check for existence of cartItem.
    if (!cartItem) {
      throw new NotFoundException(
        `The cartItem with id : ${id} is not found in the database!`,
      );
    }

    //----> Send back the response.
    return cartItem;
  }

  async update(id: string, updateCartItemDto: UpdateCartItemDto) {
    //----> Retrieve the cartItem.
    const cartItem = await this.prisma.cartItem.findUnique({ where: { id } });

    //----> Check for existence of cartItem.
    if (!cartItem) {
      throw new NotFoundException(
        `The cartItem with id : ${id} is not found in the database!`,
      );
    }

    //----> Store the updated cartItem in the database.
    const updatedCartItem = await this.prisma.cartItem.update({
      where: { id },
      data: { ...updateCartItemDto },
    });

    //----> Send back the response.
    return updatedCartItem;
  }

  async remove(id: string) {
    //----> Retrieve the cartItem.
    const cartItem = await this.prisma.cartItem.findUnique({ where: { id } });

    //----> Check for existence of cartItem.
    if (!cartItem) {
      throw new NotFoundException(
        `The cartItem with id : ${id} is not found in the database!`,
      );
    }

    //----> Delete the cartItem from the database.
    const deletedCartItem = await this.prisma.cartItem.delete({
      where: { id },
    });

    //----> Send back the response.
    return deletedCartItem;
  }
}
