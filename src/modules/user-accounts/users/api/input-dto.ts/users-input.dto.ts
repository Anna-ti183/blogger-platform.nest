//описывать входящие параметры запроса (такие как body, query, params) в виде классов. 
// Это связано с тем, что во время выполнения NestJS автоматически создает экземпляры этих классов. 
// Это упрощает валидацию и трансформацию данных (например, санитайзинг) с помощью специальных декораторов.

import { CreateUserDto } from "../../dto/create-user.dto.js";

export class CreateUserInputDto implements CreateUserDto {
  login: string;
  password: string;
  email: string;
}