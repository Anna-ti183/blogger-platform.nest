import { Module } from '@nestjs/common';
import {  UsersController } from './users/api/users-controller.js';
import {  UsersService } from './users/application/users-service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/domain/user-entity.js';
import { UsersRepository } from './users/infrastucture/users-repository.js';
import { UsersQueryRepository } from './users/infrastucture/query/users-query.repository.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersQueryRepository]
})
export class UserAccountsModule {}
