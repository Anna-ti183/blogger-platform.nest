import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async clearAllData(): Promise<void> {
    const db = this.connection.db;

    if (!db) {
      throw new Error('Database connection is not established');
    }

    //получает список коллекций базы данных
    const collections = await db.collections(); 

    //Promise.all() позволяет очистить коллекции параллельно.
    await Promise.all(
        //deleteMany({}) удаляет все документы из коллекции.
      collections.map((collection) => collection.deleteMany({})),
    );
  }
}