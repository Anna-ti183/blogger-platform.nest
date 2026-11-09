import { InjectModel } from '@nestjs/mongoose';

import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from '../domain/user-entity.js';
import type { UserModelType } from '../domain/user-entity.js';
 
@Injectable()
export class UsersRepository {
  //инжектирование модели через DI
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}
 
 
 
  async save(user: UserDocument) {
    await user.save();
  }
 

}