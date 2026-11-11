import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module.js";
import { appSetup } from "../src/setup/app.setup.js";
import request = require('supertest');

describe.skip('CommentsController (e2e)', () => {
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

    //GET/comments/id
    it('✅should return a comments by ID', async () => {
        const resultBlog = await request(app.getHttpServer()) //обращаемся к запущенному Nest-приложению. Это как отправить запрос через Postman.
            // Создаём  блог
            .post('/api/blogs')
            .send({
                name: 'First blog',
                description: 'First description',
                websiteUrl: 'https://first.com',
            })
            .expect(201);

        const idBlog = resultBlog.body.id;

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

        // Создаём  комментарий
        const resultComment = await request(app.getHttpServer())
        .post(`/api/posts/${postId}/comments`)
            .send({
                content: 'Test content',
            })
            .expect(201);

        const id = resultComment.body.id;

        //Получаем комментарий по ID 
        const response = await request(app.getHttpServer())
            .get(`/api/comments/${id}`)
            .expect(200);

        expect(response.body.id).toBe(id); 
        expect(response.body.content).toBe('Test content'); 
    });
});
