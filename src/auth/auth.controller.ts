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

@IsPublic()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Patch()
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }

  @Patch()
  editPassword(@Body() editProfileDto: EditProfileDto) {
    return this.authService.editProfile(editProfileDto);
  }

  @Post()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post()
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
}
