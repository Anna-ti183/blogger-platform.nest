import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { argon2Service } from '../../auth/adapters/argon2-service.js';
import { User } from '../domain/user-entity.js';
import type { UserModelType } from '../domain/user-entity.js';
import { UsersRepository } from '../infrastucture/users-repository.js';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { UsersQueryRepository } from '../infrastucture/query/users-query.repository.js';
 
@Injectable()
export class UsersService {
  constructor(
    //инжектирование модели в сервис через DI
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository
  ) {}
 
  //POST users
  async createUser(dto: CreateUserDto): Promise<string> {
    //TODO: move to brypt service
    const passwordHash = await argon2Service.generateHash(dto.password);
 
    const user = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      passwordHash: passwordHash, //passwordHash потому что в БД он джолжен храниться захэшированный 
    });
 
    await this.usersRepository.save(user);
 
    return user._id.toString();
  }
 
  //DELETE users/id
  async deleteUser(id: string) {
    const user = await this.usersQueryRepository.findOrNotFoundFail(id);
 
    user.makeDeleted();
 
    await this.usersRepository.save(user);
  }
}
