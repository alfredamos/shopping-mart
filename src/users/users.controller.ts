import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CurrentUserDto } from './dto/current-user.dto';
import { RoleChangeDto } from 'src/auth/dto/role-change.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('Admin')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles('Admin')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles('Admin')
  @Patch('change-role')
  updateUserRole(
    @Body() roleChangeDto: RoleChangeDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.usersService.updateUserRole(roleChangeDto, user);
  }

  @Roles('Admin', 'Customer')
  @Get('current-user')
  getCurrentUser(@CurrentUser() user: CurrentUserDto) {
    return this.usersService.getCurrentUser(user);
  }

  @Roles('Admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Roles('Admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
