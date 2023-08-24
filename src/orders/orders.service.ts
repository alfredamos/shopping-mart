import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId } = createOrderDto;
    console.log('order-dto : ', createOrderDto);
    //----> Retrieve the user attached to this order
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    //---> Check for the existence of user.
    if (!user) {
      throw new NotFoundException(
        `The user with userId = ${userId} doesn't exist in the database!`,
      );
    }

    const { cartItems, ...rests } = createOrderDto;

    //----> Create an order.
    const order = await this.prisma.order.create({
      data: {
        ...rests,
        cartItems: {
          create: [...cartItems],
        },
      },
      include: {
        cartItems: true,
      },
    });

    //----> Send back response.
    return order;
  }

  async findAll() {
    //----> Retrieve all orders.
    const allOrders = await this.prisma.order.findMany({});

    //----> Check for existence of products.
    if (!allOrders || allOrders.length <= 0) {
      throw new NotFoundException('Orders are not found in the database!');
    }

    //----> Send back the response.
    return allOrders;
  }

  async findOne(id: string) {
    //----> Retrieve the order.
    const order = await this.prisma.order.findUnique({ where: { id } });

    //----> Check for existence of order.
    if (!order) {
      throw new NotFoundException(
        `The order with id : ${id} is not found in the database!`,
      );
    }

    //----> Send back the response.
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const { userId } = updateOrderDto;

    //----> Retrieve the user attached to this order
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    //---> Check for the existence of user.
    if (!user) {
      throw new NotFoundException(
        `The user with userId = ${userId} doesn't exist in the database!`,
      );
    }

    //----> Retrieve the order.
    const order = await this.prisma.order.findUnique({ where: { id } });

    //----> Check for existence of order.
    if (!order) {
      throw new NotFoundException(
        `The order with id : ${id} is not found in the database!`,
      );
    }

    const { cartItems, ...rests } = updateOrderDto;
    console.log('rests : ', rests);
    //----> Store the updated order in the database.
    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        ...rests,
        cartItems: {
          updateMany: {
            where: { id },
            data: [...cartItems],
          },
        },
      },
      include: {
        cartItems: true,
      },
    });

    //----> Send back the response.
    return updatedOrder;
  }

  async remove(id: string) {
    //----> Retrieve the order.
    const order = await this.prisma.order.findUnique({ where: { id } });

    //----> Check for existence of order.
    if (!order) {
      throw new NotFoundException(
        `The order with id : ${id} is not found in the database!`,
      );
    }

    //----> Delete the order from the database.
    const deletedOrder = await this.prisma.order.delete({
      where: { id },
      include: {
        cartItems: true,
      },
    });

    //----> Send back the response.
    return deletedOrder;
  }
}
