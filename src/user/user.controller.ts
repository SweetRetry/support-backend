// user.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

import {
  UpdateUserPasswordDto,
  UpdateUserRoleDto,
} from './dto/update-user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  async login(@Body() body: CreateUserDto) {
    return this.userService.login(body.email, body.password);
  }

  @Post('updatePassword')
  @ApiOperation({ summary: '修改密码' })
  @ApiResponse({ status: 200, description: '修改密码成功' })
  async updatePassword(@Body() body: UpdateUserPasswordDto) {
    return this.userService.updatePassword(body.id, body.password!);
  }

  @Post('role/update')
  @ApiOperation({ summary: '修改用户角色' })
  @ApiResponse({ status: 200, description: '修改用户角色成功' })
  async updateRole(@Body() body: UpdateUserRoleDto) {
    return this.userService.updateRoleId(body.id, body.roleId);
  }
}
