// user.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { compare, hash, hashSync } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { Permission, User } from '@prisma/client';
import { RoleService } from 'src/role/role.service';
import { UpdateUserPasswordDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private roleService: RoleService,
    private jwtService: JwtService,
  ) {}

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async login(
    email: string,
    pass: string,
  ): Promise<{ userId: string; access_token: string }> {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const isPasswordValid = await compare(pass, user.password);

    if (!isPasswordValid) {
      throw new NotFoundException('password is not valid');
    }

    let permissions: string[] | undefined = undefined;

    if (user.roleId) {
      const role = await this.roleService.findRoleById(user.roleId);
      permissions = role?.permissions.map((item) => item.name);
    }

    const payload = { userId: user.id, email: user.email, permissions };
    return {
      userId: user.id,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async createOne(data: CreateUserDto) {
    const user = await this.findUserByEmail(data.email);
    if (user?.id) {
      throw new BadRequestException('user has been registered');
    }
    const hashedPassword = hashSync(data.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return { id: newUser.id, email: newUser.email };
  }

  async updatePassword(data: UpdateUserPasswordDto) {
    const user = await this.findUserById(data.id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const hashedOldPassword = await hash(data.password, 10);

    if (user.password !== hashedOldPassword) {
      throw new UnauthorizedException('old password is not valid');
    }

    const hashedPassword = await hash(data.password, 10);

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
    const user = await this.findUserById(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const role = await this.roleService.findRoleById(roleId);

    if (!role) {
      throw new NotFoundException('role not found');
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

  async getUserInfo(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
    if (user) {
      return {
        id: user.id,
        email: user.email,
        role: user.role?.name,
        permissions: user.role?.permissions.map((item) => item.name),
      };
    }
    return;
  }
}
