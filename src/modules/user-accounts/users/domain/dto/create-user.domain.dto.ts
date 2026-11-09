// доменная модель которое гуляет внутри нашего приложения 

export class CreateUserDomainDto {
  login: string;
  email: string;
  passwordHash: string;
}