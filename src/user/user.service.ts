// user.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { hash, compare } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { TokenUtil } from 'src/utils/tokenUtil';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private roleService: RoleService,
  ) {}

  async findUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  // 登录
  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string; id: string }> {
    const user = await this.findUserByEmail(email);

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('密码错误');
    }

    // 生成JWT
    const payload = { id: user.id, email: user.email, roleId: user.roleId };
    const token = TokenUtil.generateToken(payload);
    return { access_token: token, id: user.id };
  }

  async create(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (user.id) {
      throw new UnauthorizedException('用户已存在');
    }
    const hashedPassword = await hash(password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return { id: newUser.id, email: newUser.email };
  }

  async updatePassword(email: string, password: string) {
    const user = await this.findUserByEmail(email);

    const hashedPassword = await hash(password, 10);
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return null;
  }

  async updateRoleId(id: string, roleId: string) {
    await this.findUserById(id);

    const role = await this.roleService.findRoleById(roleId);

    if (!role?.editable) {
      throw new UnauthorizedException('角色不可编辑');
    }

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        roleId,
      },
    });

    return null;
  }
}
