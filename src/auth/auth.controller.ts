/* eslint-disable prettier/prettier */
import {
  Controller, 
  Post,
  Body,
  Patch,
//  Param,
//  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EditProfileDto } from './dto/edit-profile.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { IsPublic } from 'src/decorators/is-public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CurrentUserDto } from 'src/users/dto/current-user.dto';
import { RoleChangeDto } from './dto/role-change.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Roles('Admin', 'Customer')
  @Patch('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }

  @Roles('Admin', 'Customer')
  @Patch('edit-profile')
  editPassword(@Body() editProfileDto: EditProfileDto) {
    return this.authService.editProfile(editProfileDto);
  }

  @IsPublic()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @IsPublic()
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Roles('Admin')  
  @Patch('change-role')
  updateUserRole(
    @Body() roleChangeDto: RoleChangeDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.authService.updateUserRole(roleChangeDto, user);
  }
}
