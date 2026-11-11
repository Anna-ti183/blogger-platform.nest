import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module.js";
import { appSetup } from "../src/setup/app.setup.js";
import request = require('supertest');

describe('UsersController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        appSetup(app);

        await app.init();
  });
  
    // Перед каждым тестом очищаем базу данных
    beforeEach(async () => {
        await request(app.getHttpServer())
            .delete('/api/testing/all-data')
            .expect(204);
    });

    afterAll(async () => {
        await app.close();
    });

    //GET/users
    it('✅should return all users', async () => {

        await request(app.getHttpServer())
            // Создаём первого польз-я
            .post('/api/users')
            .send({
                login: 'Test1User',
                password: 'testUser1',
                email: 'test@user1.com',
            })
            .expect(201);

        await request(app.getHttpServer())
            // Создаём первого польз-я
            .post('/api/users')
            .send({
                login: 'Test2User',
                password: 'testUser2',
                email: 'test@user2.com',
            })
            .expect(201);

        // Получаем всух польз-ей
        const response = await request(app.getHttpServer())
            .get('/api/users')
            .expect(200);

        expect(response.body.items).toHaveLength(2);


        expect(response.body.items[0].login).toBe('Test2User');
        expect(response.body.items[1].login).toBe('Test1User');

        expect(response.body.totalCount).toBe(2);
    });

    //POST/users
    it('✅should create user', async () => {
        const createResponseUser = await request(app.getHttpServer())
            .post('/api/users')
            .send({
                login: 'TestUser',
                password: 'testUser',
                email: 'test@user.com',
            })
            .expect(201);

        //вернуть созданного польз-я
        expect(createResponseUser.body).toEqual({
            id: expect.any(String),
            login: 'TestUser',
            email: 'test@user.com',
            createdAt: expect.any(String),
        });
    });

    //DELETE/users/id
    it('✅should delete user by ID', async () => {
        const createResponseUser = await request(app.getHttpServer())
            // Создаём  польз-я
            .post('/api/users')
            .send({
                login: 'TestUser',
                password: 'testUser',
                email: 'test@user.com',
            })
            .expect(201);

        //получаем ID
        const id = createResponseUser.body.id;

        //удаляем польз-я по ID
        await request(app.getHttpServer())
            .delete(`/api/users/${id}`)
            .expect(204);

        //проверяем через GET что польз-я уже не существует 
        await request(app.getHttpServer())
            .get(`/api/users/${id}`)
            .expect(404);
    });
});
