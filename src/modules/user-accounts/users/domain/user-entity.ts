//флаг timestemp автоматичеки добавляет поля upatedAt и createdAt

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { CreateUserDomainDto } from "./dto/create-user.domain.dto.js";

/**
 * User Entity Schema
 * Этот класс описывает схему и поведение сущности «Пользователь»
 */
@Schema({ timestamps: true }) //timestamps: true автоматически добавляет два поля: createdAt, updatedAt
export class User {
  /**
   * Login of the user (must be uniq)
   * @type {string}
   * @required
   */
  //@Prop() сообщает NestJS/Mongoose, что это поле должно присутствовать в схеме.
  @Prop({ type: String, required: true })
  login: string;
 
  /**
   * Password hash for authentication
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  passwordHash: string;
 
  /**
   * Email of the user
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  email: string;
 
  /**
   * Creation timestamp
   * Явно определено, несмотря на timestamps: true
   * свойства без @Prop в TypeScript — чтобы они находились в экземпляре класса (или были доступны в методах экземпляра)
   * @type {Date}
   */
  createdAt: Date;
  updatedAt: Date;

   /**
   * Deletion timestamp, nullable, if date exist, means entity soft deleted
   * @type {Date | null}
   */
  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
 
 //static createInstance() — это статический метод класса User, который создаёт новый экземпляр пользователя.
 // Он нужен для того чтобы централизованно создавать пользователей и заполнять их начальными данными
  static createInstance(dto: CreateUserDomainDto): UserDocument {
    const user = new this();
    user.email = dto.email;
    user.passwordHash = dto.passwordHash;
    user.login = dto.login;
  
    return user as UserDocument;
  }
 
   /**
   * Помечает пользователя как удаленного
   *  Выдает ошибку, если уже удалено
   * @throws {Error} Если объект уже удален
   * DDD continue: инкапсуляция (вызываем методы, которые меняют состояние\св-ва) объектов согласно правилам этого объекта
   */
  makeDeleted() {
    if (this.deletedAt != null) {
      throw new Error('Entity already deleted');
    }
    this.deletedAt = new Date();
  }
}
 //создает схему на основе класса
export const UserSchema = SchemaFactory.createForClass(User);
 
//регистрирует наши методы в схеме монгуcа
UserSchema.loadClass(User);
 
//Типизация документа
export type UserDocument = HydratedDocument<User>;
 
//типизация модели со статическими и инстанс методами.
export type UserModelType = Model<UserDocument> & typeof User;
 