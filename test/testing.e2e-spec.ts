
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module.js';
import { appSetup } from '../src/setup/app.setup.js';
import request = require('supertest');


describe('TestingController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        appSetup(app);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should delete all data and return 204', async () => {
        // Создаём блог
        const createResponseBlog = await request(app.getHttpServer())
            .post('/api/blogs')
            .send({
                name: 'Test blog',
                description: 'Test description',
                websiteUrl: 'https://test.com',
            })
            .expect(201);

        //получаем ID блога
        const idBlog = createResponseBlog.body.id;

        const createResponsePost = await request(app.getHttpServer())
            // Создаём  пост
            .post('/api/posts')
            .send({
                title: 'Test post',
                shortDescription: 'Test shortDescription',
                content: 'Test content',
                blogId: idBlog,
            })
            .expect(201);

        const postId = createResponsePost.body.id;
/*
        // Создаём  комментарий
        await request(app.getHttpServer())
            .post(`/api/posts/${postId}/comments`)
            .send({
                content: 'Test content',
            })
            .expect(201);
*/
        // Создаём польз-я
        await request(app.getHttpServer())
            .post('/api/users')
            .send({
                login: 'TestUser',
                password: 'testUser',
                email: 'test@user.com',
            })
            .expect(201);

        // Очищаем базу данных
        await request(app.getHttpServer())
            .delete('/api/testing/all-data')
            .expect(204);

        // Проверяем, что блоги удалены
        const responseBlogs = await request(app.getHttpServer())
            .get('/api/blogs')
            .expect(200);

        // Проверяем, что посты удалены
        const responsePosts = await request(app.getHttpServer())
            .get('/api/posts')
            .expect(200);

        
        // Проверяем, что польз-и удалены
        const responseUsers = await request(app.getHttpServer())
            .get('/api/users')
            .expect(200);


        expect(responseBlogs.body.items).toHaveLength(0);
        expect(responseBlogs.body.totalCount).toBe(0);
        expect(responsePosts.body.items).toHaveLength(0);
        expect(responsePosts.body.totalCount).toBe(0);
        expect(responseUsers.body.items).toHaveLength(0);
        expect(responseUsers.body.totalCount).toBe(0);
    });
});