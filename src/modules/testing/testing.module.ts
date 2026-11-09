import { Module } from '@nestjs/common';
import { TestingController } from './api/testing-controller.js';
import { TestingRepository } from './infrastucture/testing-repository.js';

@Module({
    controllers: [TestingController],
    providers: [TestingRepository],
})
export class TestingModule { }
