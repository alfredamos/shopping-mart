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
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CurrentUserDto } from 'src/users/dto/current-user.dto';
import { RoleChangeDto } from './dto/role-change.dto';

@IsPublic()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Patch('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }

  @Patch('change-role')
  updateUserRole(@CurrentUser() user: CurrentUserDto, @Body() roleChangeDto: RoleChangeDto) {
    return this.authService.updateUserRole(user, roleChangeDto);
  }

  @Patch('edit-profile')
  editPassword(@Body() editProfileDto: EditProfileDto) {
    return this.authService.editProfile(editProfileDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
}
