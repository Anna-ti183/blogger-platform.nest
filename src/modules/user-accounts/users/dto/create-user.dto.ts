//Тут будут храниться dto, которые мы будем использовать для работы с сущностью user

export class CreateUserDto {
  login: string;
  email: string;
  password: string;
}