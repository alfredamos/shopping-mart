import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartItemsService {
  constructor(private prisma: PrismaService) {}

  async create(createCartItemDto: CreateCartItemDto) {
    const { productId } = createCartItemDto;

    //----> Retrieve the product.
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    //----> Check for existence of product.
    if (!product) {
      throw new NotFoundException(
        `The product with id : ${productId} doesn't exist!`,
      );
    }

    //----> Create an cartItem.
    const cartItem = await this.prisma.cartItem.create({
      data: { ...createCartItemDto },
    });

    //----> Send back response.
    return cartItem;
  }

  async findAll() {
    //----> Retrieve all cartItems.
    const allCartItems = await this.prisma.cartItem.findMany({});

    //----> Check for existence of products.
    if (!allCartItems || allCartItems.length === 0) {
      throw new NotFoundException('CartItems are not found in the database!');
    }

    //----> Send back the response.
    return allCartItems;
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
    const { productId } = updateCartItemDto;

    //----> Retrieve the product.
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    //----> Check for existence of product.
    if (!product) {
      throw new NotFoundException(
        `The product with id : ${productId} doesn't exist!`,
      );
    }

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
