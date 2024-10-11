import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Permission } from 'src/decorators/permission.decorator';
import { PermissionEnum } from 'src/enums/permission.enum';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get(':id')
  @ApiOperation({ summary: '获取角色信息' })
  findOne(@Param('id') id: string) {
    return this.roleService.findRoleById(id);
  }

  @Get('all')
  @ApiOperation({ summary: '获取所有角色' })
  getAllRole(@Query() params: { pageId: number; pageSize: number }) {
    return this.roleService.getAllRole(params);
  }

  @Post('create')
  @Permission(PermissionEnum.CREATE_ROLE)
  @ApiOperation({ summary: '创建角色' })
  createRole(@Body() body: CreateRoleDto) {
    return this.roleService.createRole(body);
  }

  @Patch('update')
  @Permission(PermissionEnum.EDIT_ROLE)
  @ApiOperation({ summary: '更新角色权限' })
  updateRole(@Body() body: UpdateRoleDto) {
    return this.roleService.updateRole(body);
  }

  @Delete(':id')
  @Permission(PermissionEnum.DELETE_ROLE)
  @ApiOperation({ summary: '删除角色' })
  deleteRole(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }
}
