import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    //----> Create an category.
    const category = await this.prisma.category.create({
      data: { ...createCategoryDto },
    });

    //----> Send back response.
    return category;
  }

  async findAll() {
    //----> Retrieve all categories.
    const allCategories = await this.prisma.category.findMany({});

    //----> Check for existence of products.
    if (!allCategories || allCategories.length === 0) {
      throw new NotFoundException('Categories are not found in the database!');
    }

    //----> Send back the response.
    return allCategories;
  }

  async findOne(id: string) {
    //----> Retrieve the category.
    const category = await this.prisma.category.findUnique({ where: { id } });

    //----> Check for existence of category.
    if (!category) {
      throw new NotFoundException(
        `The category with id : ${id} is not found in the database!`,
      );
    }

    //----> Send back the response.
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    //----> Retrieve the category.
    const category = await this.prisma.category.findUnique({ where: { id } });

    //----> Check for existence of category.
    if (!category) {
      throw new NotFoundException(
        `The category with id : ${id} is not found in the database!`,
      );
    }

    //----> Store the updated category in the database.
    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: { ...updateCategoryDto },
    });

    //----> Send back the response.
    return updatedCategory;
  }

  async remove(id: string) {
    //----> Retrieve the category.
    const category = await this.prisma.category.findUnique({ where: { id } });

    //----> Check for existence of category.
    if (!category) {
      throw new NotFoundException(
        `The category with id : ${id} is not found in the database!`,
      );
    }

    //----> Delete the category from the database.
    const deletedCategory = await this.prisma.category.delete({
      where: { id },
    });

    //----> Send back the response.
    return deletedCategory;
  }
}
