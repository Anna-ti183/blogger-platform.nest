import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module.js';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreModule } from './core/core.module.js';
import { TestingModule } from './modules/testing/testing.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/blogger-platform'),
    BloggersPlatformModule,
    UserAccountsModule,
    CoreModule,
    TestingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
