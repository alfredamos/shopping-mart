/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { EditProfileDto } from './dto/edit-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcryptjs"
import { UserInfo } from 'src/models/userInfoModel';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { email, newPassword, oldPassword, confirmPassword } = changePasswordDto;

    //----> Check for match between newPassword and confirmPassword.
    if (newPassword.normalize() !== confirmPassword.normalize()){
      throw new BadRequestException("Passwords must match!")
    } 

    //----> Retrieve the user.
    const user = await this.prisma.user.findUnique({ where: { email } });

    //----> Check for the existence of user.
    if (!user) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    //----> Retrieve the old password.
    const oldHashedPassword = user.password;

    //----> Check for the correctness of password.
    const isValid = await bcrypt.compare(oldPassword, oldHashedPassword);

    if (!isValid){
      throw new UnauthorizedException("Invalid credentials!");
    }

    //----> Hash the new password.
    const newHashedPassword = await bcrypt.hash(newPassword, 12)
  
    //----> Insert the new password in the database.
    const updatedUserDetail = await this.prisma.user.update({where: {email}, data: {...user, password: newHashedPassword}});
  
    //----> Get new token.
    const token = await this.jwt.sign({
      id: updatedUserDetail.id,
      name: updatedUserDetail.name,
      role: updatedUserDetail.role,
    })

    //----> User info.
    const userInfo: UserInfo = {
      id: updatedUserDetail.id,
      name: updatedUserDetail.name,
      role: updatedUserDetail.role,
      token,
      message: "Password has been successfully updated!"
    };

    return userInfo;
  }

  async editProfile(editProfileDto: EditProfileDto) {
    const { email, password } = editProfileDto;

    //----> Retrieve the user.
    const user = await this.prisma.user.findUnique({ where: { email } });

    //----> Check for the existence of user.
    if (!user) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    //----> Retrieve the password in the database.
    const hashedPassword = user.password;

    //----> Check for the correctness of password.
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    //----> Store the change in the database.
    const updatedUserDetail = await this.prisma.user.update({
      where: { email },
      data: { ...editProfileDto, id: user.id, password: hashedPassword },
    });

    //----> Get new token.
    const token = await this.jwt.sign({
      id: updatedUserDetail.id,
      name: updatedUserDetail.name,
      role: updatedUserDetail.role,
    });

    //----> User info.
    const userInfo: UserInfo = {
      id: updatedUserDetail.id,
      name: updatedUserDetail.name,
      role: updatedUserDetail.role,
      token,
      message: 'User info has been successfully updated!',
    };

    return userInfo;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    //----> Retrieve the user.
    const user = await this.prisma.user.findUnique({ where: { email } });

    //----> Check for the existence of user.
    if (!user) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    //----> Retrieve the password in the database.
    const hashedPassword = user.password;

    //----> Check for the correctness of password.
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    //----> Get new token.
    const token = await this.jwt.sign({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    //----> User info.
    const userInfo: UserInfo = {
      id: user.id,
      name: user.name,
      role: user.role,
      isLoggedIn: true,
      token,
      message: 'Login is successful!',
    };

    return userInfo;
  }

  async signup(signupDto: SignupDto) {
    const { email, password, confirmPassword } = signupDto;

    //----> password and confirmPassword must match.
    if (password.normalize() !== confirmPassword.normalize()) {
      throw new BadRequestException('Password must match confirm password!');
    }

    delete signupDto.confirmPassword;

    //----> Retrieve the user.
    const user = await this.prisma.user.findUnique({ where: { email } });

    //----> Check for the existence of user.
    if (user) {
      throw new BadRequestException('User already exists!');
    }

    //----> Hash the new password.
    const hashedPassword = await bcrypt.hash(password, 12);

    //----> Store the new user in the database.
    const newUser = await this.prisma.user.create({
      data: { ...signupDto, password: hashedPassword },
    });

    //----> Get new token.
    const token = await this.jwt.sign({
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
    });

    //----> User info.
    const userInfo: UserInfo = {
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
      token,
      message: 'Signup is successful!',
    };

    return userInfo;
  }
}
