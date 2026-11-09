import { Global, Module } from '@nestjs/common';

//глобальный модуль для провайдеров и модулей необходимых во всех частях приложения
@Global()
@Module({})
export class CoreModule {}
