import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItem } from '@prisma/client';
import { StatusDto } from './dto/status.dto';

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

    //----> Destructure cart items from the createOrderDto
    const { cartItems, ...rests } = createOrderDto;

    //----> Aggregate the total price of all cart items.
    rests.total = this.totalPrice(cartItems);
    rests.items = this.totalNumberOfItems(cartItems);

    //----> Create an order.
    const order = await this.prisma.order.create({
      data: {
        ...rests,
        cartItems: {
          createMany: {
            data: [...cartItems],
          },
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
    const allOrders = await this.prisma.order.findMany({
      include: {
        cartItems: {
          select: {
            product: true,
            id: true,
            quantity: true,
            price: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            gender: true,
          },
        },
      },
    });

    //----> Check for existence of products.
    if (!allOrders || allOrders.length <= 0) {
      throw new NotFoundException('Orders are not found in the database!');
    }

    //----> Send back the response.
    return allOrders;
  }

  async findOne(id: string) {
    //----> Retrieve the order.
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        cartItems: {
          select: {
            product: true,
            id: true,
            quantity: true,
            price: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            gender: true,
          },
        },
      },
    });

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

    //----> Destructure the payload.
    const { cartItems, ...rests } = updateOrderDto;

    //----> Update cart items.
    this.updateCartItems(cartItems);

    //----> Aggregate the total price of all cart items.
    rests.total = this.totalPrice(cartItems);
    rests.items = this.totalNumberOfItems(cartItems);

    //----> Update the order in the database.
    await this.prisma.order.update({
      where: { id },
      data: {
        ...rests,
      },
    });

    //----> Retrieve the latest updated order.
    const updatedOrder = await this.prisma.order.findUnique({
      where: { id },
      include: {
        cartItems: true,
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            gender: true,
          },
        },
      },
    });

    //----> Send back the response.
    return updatedOrder;
  }

  async updateOrderStatus(id: string, statusDto: StatusDto) {
    //----> Retrieve the order to update his status from database.
    const order = await this.prisma.order.findUnique({ where: { id } });

    //----> Destructure status from StatusDto.
    const { status } = statusDto;

    //----> Check for the existence of order.
    if (!order) {
      throw new NotFoundException(
        `The order with id : ${id} is not found the database!`,
      );
    }

    //----> Update the order status in the database.
    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { ...order, status },
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

    //----> Delete the cart items from the database.
    await this.prisma.order.update({
      where: {
        id,
      },
      data: {
        cartItems: {
          deleteMany: {},
        },
      },
      include: {
        cartItems: true,
      },
    });

    //----> Delete the order.
    const deletedOrder = await this.prisma.order.delete({ where: { id } });

    //----> Send back the response.
    return deletedOrder;
  }

  private totalPrice(cartItems: CartItem[]) {
    return cartItems.reduce(
      (prev, cartItem) => Number(cartItem.price) * cartItem.quantity + prev,
      0,
    );
  }

  private totalNumberOfItems(cartItems: CartItem[]) {
    return cartItems.reduce(
      (prev, cartItem) => Number(cartItem.quantity) + prev,
      0,
    );
  }

  private updateCartItems(cartItems: CartItem[]) {
    return cartItems.map(async (item) => {
      return await this.prisma.cartItem.update({
        where: { id: item.id },
        data: { ...item },
      });
    });
  }
}
