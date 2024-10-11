// user.controller.ts
import { Body, Controller, Get, Patch, Post, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

import {
  UpdateUserPasswordDto,
  UpdateUserRoleDto,
} from './dto/update-user.dto';

import { Public } from 'src/decorators/public.decorator';
import { Permission } from 'src/decorators/permission.decorator';
import { PermissionEnum } from 'src/enums/permission.enum';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('userInfo')
  @ApiOperation({ summary: '获取用户信息' })
  async getUserInfo(@Request() req: Express.Request) {
    return this.userService.getUserInfo(req.user.userId);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  async login(@Body() body: CreateUserDto) {
    return this.userService.login(body.email, body.password);
  }

  @Post('create')
  @Permission(PermissionEnum.CREATE_USER)
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() body: CreateUserDto) {
    return this.userService.createOne(body);
  }

  @Patch('update-password')
  @Permission(PermissionEnum.RESET_PWD_USER)
  @ApiOperation({ summary: '修改密码' })
  async updatePassword(@Body() data: UpdateUserPasswordDto) {
    return this.userService.updatePassword(data);
  }

  @Patch('role/update')
  @Permission(PermissionEnum.EDIT_USER)
  @ApiOperation({ summary: '修改用户角色' })
  async updateRole(@Body() body: UpdateUserRoleDto) {
    return this.userService.updateRoleId(body.id, body.roleId);
  }
}
