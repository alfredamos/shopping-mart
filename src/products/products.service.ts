import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { categoryId } = createProductDto;

    //----> Retrieve the category.
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    //----> Check for the existence of category.
    if (!category) {
      throw new NotFoundException(
        `The category with categoryId : ${categoryId} doesn't exist in the database!`,
      );
    }

    //----> Create a product.
    const product = await this.prisma.product.create({
      data: { ...createProductDto },
    });

    //----> Send back response.
    return product;
  }

  async findAll() {
    //----> Retrieve all products.
    const allProducts = await this.prisma.product.findMany({
      include: { cartItems: true, category: true },
    });

    //----> Check for existence of products.
    if (!allProducts || allProducts.length <= 0) {
      throw new NotFoundException('Products are not found in the database!');
    }

    //----> Send back the response.
    return allProducts;
  }

  async findOne(id: string) {
    //----> Retrieve the product.
    const product = await this.prisma.product.findUnique({ where: { id } });

    //----> Check for existence of product.
    if (!product) {
      throw new NotFoundException(
        `The product with id : ${id} is not found in the database!`,
      );
    }

    //----> Send back the response.
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { categoryId } = updateProductDto;

    //----> Retrieve the category.
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    //----> Check for the existence of category.
    if (!category) {
      throw new NotFoundException(
        `The category with categoryId : ${categoryId} doesn't exist in the database!`,
      );
    }

    //----> Retrieve the product.
    const product = await this.prisma.product.findUnique({ where: { id } });

    //----> Check for existence of product.
    if (!product) {
      throw new NotFoundException(
        `The product with id : ${id} is not found in the database!`,
      );
    }

    //----> Store the updated product in the database.
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: { ...updateProductDto },
    });

    //----> Send back the response.
    return updatedProduct;
  }

  async remove(id: string) {
    //----> Retrieve the product.
    const product = await this.prisma.product.findUnique({ where: { id } });

    //----> Check for existence of product.
    if (!product) {
      throw new NotFoundException(
        `The product with id : ${id} is not found in the database!`,
      );
    }

    //----> Delete the product from the database.
    const deletedProduct = await this.prisma.product.delete({ where: { id } });

    //----> Send back the response.
    return deletedProduct;
  }
}
