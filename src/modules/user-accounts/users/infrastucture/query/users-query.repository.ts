import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, type UserModelType } from '../../domain/user-entity.js';
import { NotFoundException } from '@nestjs/common';
import { UserViewDto } from '../../api/view-dto/users-view.dto.js';
import { GetUsersQueryParams } from '../../api/input-dto.ts/get-users-query-params.input-dto.js';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto.js';
import { QueryFilter } from 'mongoose';


 
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}
 
  //Найти юзера или выбросить ошибку + готовая модель для ответа клиенту
  async getByIdOrNotFoundFail(id: string): Promise<UserViewDto> {
    const user = await this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    });
 
    if (!user) {
      throw new NotFoundException('user not found');
    }
 
    return UserViewDto.mapToView(user);
  }

  //Найти юзера или выбросить ошибку
    async findOrNotFoundFail(id: string): Promise<UserDocument> {
        const user = await this.UserModel.findOne({
        _id: id,
        deletedAt: null,
    });
 
    if (!user) {
      //TODO: replace with domain exception
      throw new NotFoundException('user not found');
    }
 
    return user;
  }

  //Найти юзера по ID
   async findById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

 // Найти всех юзеров
 async getAll(
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const filter: QueryFilter<User> = {
      deletedAt: null,
    };

    if (query.searchLoginTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        login: { $regex: query.searchLoginTerm, $options: 'i' },
      });
    }

    if (query.searchEmailTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        email: { $regex: query.searchEmailTerm, $options: 'i' },
      });
    }

    const users = await this.UserModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.UserModel.countDocuments(filter);

    const items = users.map(UserViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}