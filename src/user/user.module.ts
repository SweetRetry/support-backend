import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleService } from 'src/role/role.service';

@Module({
  controllers: [UserController],
  providers: [UserService, RoleService],
})
export class UserModule {}
