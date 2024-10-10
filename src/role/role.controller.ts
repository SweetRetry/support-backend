import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';

import { ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findRoleById(id);
  }

  @Get('all')
  getAllRole(@Query() params: { pageId: number; pageSize: number }) {
    return this.roleService.getAllRole(params);
  }

  @Post('create')
  createRole(@Body() body: CreateRoleDto) {
    return this.roleService.createRole(body);
  }

  @Patch('update')
  updateRole(@Body() body: UpdateRoleDto) {
    return this.roleService.updateRole(body);
  }

  @Delete(':id')
  deleteRole(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }
}
