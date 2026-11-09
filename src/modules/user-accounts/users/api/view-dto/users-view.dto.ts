//Описывает данные, которые надо вернуть клиенту. 
// + маппер в виде статического метода АЛЬТЕРНАТИВА конструктор

import { UserDocument } from "../../domain/user-entity.js";

 
export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
 
  static mapToView(user: UserDocument): UserViewDto {
    const dto = new UserViewDto();
 
    dto.email = user.email;
    dto.login = user.login;
    dto.id = user._id.toString();
    dto.createdAt = user.createdAt;
 
    return dto;
  }
}