import { Controller, Body, Get, Post, Delete, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { UserViewDto } from './view-dto/users-view.dto.js';
import { CreateUserInputDto } from './input-dto.ts/users-input.dto.js';
import { UsersQueryRepository } from '../infrastucture/query/users-query.repository.js';
import { UsersService } from '../application/users-service.js';
import { GetUsersQueryParams } from './input-dto.ts/get-users-query-params.input-dto.js';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto.js';

@Controller('users')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
  ) { }


  //GET/users
  @Get()
  async getAll(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.usersQueryRepository.getAll(query);
  } //getAll(): Этот метод обрабатывает GET-запрос на маршрут /users и возвращает список всех пользователей


  //POST/users
  @Post()
  async createUser(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
    const userId = await this.usersService.createUser(body);

    return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
  } //createUser(@Body() body: CreateUserInputDto): Этот метод обрабатывает POST-запрос на маршрут /users 
  //и создает нового пользователя.
  // Он делегирует задачу сервису UsersService, который выполняет бизнес-логику

  //DELETE/users/id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}

