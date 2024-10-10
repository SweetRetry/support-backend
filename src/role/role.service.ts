import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async findRoleById(roleId: string) {
    return await this.prisma.role.findUnique({
      where: { id: roleId },
      include: { permissions: true },
    });
  }

  async getAllRole(params: { pageId: number; pageSize: number }) {
    const [_count, list] = await Promise.all([
      this.prisma.role.count(),
      this.prisma.role.findMany({
        skip: (params.pageId - 1) * params.pageSize,
        take: params.pageSize,
      }),
    ]);

    return {
      list,
      total: _count,
      totalPage: Math.ceil(_count / params.pageSize),
      ...params,
    };
  }

  async createRole(data: CreateRoleDto) {
    return await this.prisma.role.create({
      data: {
        name: data.name,
        permissions: {
          connect: data.permissionIds.map((id) => ({ id })),
        },
      },
    });
  }
  async deleteRole(roleId: string) {
    const role = await this.findRoleById(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return await this.prisma.role.delete({ where: { id: roleId } });
  }

  async updateRole(data: UpdateRoleDto) {
    const role = await this.findRoleById(data.id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return await this.prisma.role.update({
      where: { id: role.id },
      data: {
        name: data.name,
        permissions: {
          set: data.permissionIds?.map((id) => ({ id })),
        },
      },
    });
  }
}
