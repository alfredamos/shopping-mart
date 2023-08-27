import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUserDto } from './dto/current-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserInfo } from 'src/models/userInfoModel';
import { UuidTool } from 'uuid-tool';
import { Role } from '@prisma/client';
import { RoleChangeDto } from 'src/auth/dto/role-change.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, confirmPassword } = createUserDto;

    //----> Check for password match.
    if (password.normalize() !== confirmPassword.normalize()) {
      throw new BadRequestException('Password must match confirm password');
    }

    delete createUserDto.confirmPassword;

    //----> retrieve the user.
    const user = await this.prisma.user.findUnique({ where: { email } });

    //----> Check for the existence of user.
    if (user) {
      throw new BadRequestException('User already exists!');
    }

    //----> Hash password.
    const hashPassword = await bcrypt.hash(password, 12);

    //----> Store the new user in the database.
    const newUser = await this.prisma.user.create({
      data: { ...createUserDto, password: hashPassword },
    });

    //----> Get token.
    const token = await this.jwt.sign({
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
    });

    const userInfo: UserInfo = {
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
      token,
      message: 'User has been successfully created!',
    };

    //----> Send back response.
    return userInfo;
  }

  async findAll() {
    //----> Get all users.
    const allUsers = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        role: true,
      },
    });

    //----> Check for presence of users.
    if (!allUsers || allUsers.length <= 0) {
      throw new NotFoundException('No users available in the database');
    }

    //----> Send back response.
    return allUsers;
  }

  async findOne(id: string) {
    //----> Retrieve the user with the id.
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        role: true,
      },
    });

    //----> Check for the existence of user.
    if (!user) {
      throw new NotFoundException(
        `The user with id : ${id} is not found the database!`,
      );
    }

    //----> Send back the response.
    return user;
  }

  async getCurrentUser(user: CurrentUserDto): Promise<CurrentUserDto> {
    const id = user.id;

    return await this.findOne(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { id: idFromBody, password } = updateUserDto;

    //----> Check for id match.
    const isMatch = UuidTool.compare(id, idFromBody);

    if (!isMatch) {
      throw new BadRequestException('Id mismatch');
    }

    //----> Retrieve the user.
    const user = await this.prisma.user.findUnique({ where: { id } });

    //----> Check for the existence of user.
    if (!user) {
      throw new NotFoundException(
        `The user with id : ${id} is not found in the database!`,
      );
    }

    //----> Retrieve the password in the database.
    const hashPassword = user.password;

    //----> Check for correct password.
    const isValid = await bcrypt.compare(password, hashPassword);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    //----> Update the user info in the database.
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto, email: user.email, password: hashPassword },
    });

    //----> Get token.
    const token = await this.jwt.sign({
      id: updatedUser.id,
      name: updatedUser.name,
      role: updatedUser.role,
    });

    const userInfo: UserInfo = {
      id: updatedUser.id,
      name: updatedUser.name,
      role: updatedUser.role,
      token,
      message: 'User has been successfully updated!',
    };

    //----> Send back response.
    return userInfo;
  }

  async remove(id: string) {
    //----> Retrieve the user.
    const user = await this.prisma.user.findUnique({ where: { id } });

    //----> Check for the existence of user.
    if (!user) {
      throw new NotFoundException(
        `The user with id : ${id} is not found the database!`,
      );
    }

    //----> Remove user from the database.
    const deletedUser = await this.prisma.user.delete({ where: { id } });

    //----> Send back response.
    return deletedUser;
  }

  async updateUserRole(roleChangeDto: RoleChangeDto, user: CurrentUserDto) {
    //----> Extract the role of the current user from the user object.
    const adminRole = user?.role;
    console.log({ user, roleChangeDto });
    //----> Check for admin rights.
    if (adminRole !== Role.Admin) {
      throw new ForbiddenException(
        'You are not permitted to perform the task!',
      );
    }

    //----> Destructure for role and email.
    const { email, role } = roleChangeDto;

    //----> Extract the details of the user to with role to be updated.
    const userToHaveNewRole = await this.prisma.user.findUnique({
      where: { email },
    });

    //----> Check for the existence of user.
    if (!userToHaveNewRole) {
      throw new NotFoundException(
        `The user with email : ${email} is not found in the database!`,
      );
    }

    //----> Update the user new role in the database.
    const userRoleUpdated = await this.prisma.user.update({
      where: { email },
      data: { ...userToHaveNewRole, role },
    });

    //----> Send back the response.
    return userRoleUpdated;
  }
}
