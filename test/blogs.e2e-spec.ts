import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module.js";
import { appSetup } from "../src/setup/app.setup.js";
import request = require('supertest');
import { MyStatus } from "../src/modules/bloggers-platform/posts/domain/enum/posts-enum.myStatus.js";

describe('BlogsController (e2e)', () => {
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


    //GET/blogs
    it('✅should return all blogs', async () => {

        await request(app.getHttpServer())
            // Создаём первый блог
            .post('/api/blogs')
            .send({
                name: 'First blog',
                description: 'First description',
                websiteUrl: 'https://first.com',
            })
            .expect(201);

        await request(app.getHttpServer())
            // Создаём второй блог
            .post('/api/blogs')
            .send({
                name: 'Second blog',
                description: 'Second description',
                websiteUrl: 'https://second.com',
            })
            .expect(201);

        // Получаем все блоги
        const response = await request(app.getHttpServer())
            .get('/api/blogs')
            .expect(200);

        expect(response.body.items).toHaveLength(2);

        //сортировка по умолчанию идёт по createdAt в порядке убывания (DESC), поэтому последний созданный блог должен быть первым
        expect(response.body.items[0].name).toBe('Second blog');
        expect(response.body.items[1].name).toBe('First blog');

        expect(response.body.totalCount).toBe(2);
    });

    //GET/blogs/id
    it('✅should return a blog by ID', async () => {
        const createResponseBlog = await request(app.getHttpServer()) //обращаемся к запущенному Nest-приложению. Это как отправить запрос через Postman.
            // Создаём  блог
            .post('/api/blogs')
            .send({
                name: 'First blog',
                description: 'First description',
                websiteUrl: 'https://first.com',
            })
            .expect(201);

        //получаем ID
        const id = createResponseBlog.body.id;

        //Получаем блог по ID
        const response = await request(app.getHttpServer())
            .get(`/api/blogs/${id}`)
            .expect(200);

        expect(response.body.id).toBe(id); //проверка: ID полученного блога совпадает с ID того блога, который мы создали
        expect(response.body.name).toBe('First blog'); //проверка: имя блога действительно First blog
    });

    //GET/blogs/blogId/posts
    it('✅ should return all posts by Blog', async () => {

        const createResponseBlog = await request(app.getHttpServer())
            // Создаём блог
            .post('/api/blogs')
            .send({
                name: 'First blog',
                description: 'First description',
                websiteUrl: 'https://first.com',
            })
            .expect(201);

        const blogId = createResponseBlog.body.id;

        await request(app.getHttpServer())
            // Создаём первый пост
            .post('/api/posts')
            .send({
                title: 'Test1 post',
                shortDescription: 'Test1 shortDescription',
                content: 'Test1 content',
                blogId: blogId,
            })
            .expect(201);

        await request(app.getHttpServer())
            // Создаём второй пост
            .post('/api/posts')
            .send({
                title: 'Test2 post',
                shortDescription: 'Test2 shortDescription',
                content: 'Test2 content',
                blogId: blogId,
            })
            .expect(201);

        // Получаем все посты
        const response = await request(app.getHttpServer())
            .get(`/api/blogs/${blogId}/posts`)
            .expect(200);

        expect(response.body.items).toHaveLength(2);

        expect(response.body.items[0].title).toBe('Test2 post');
        expect(response.body.items[1].title).toBe('Test1 post');

        expect(response.body.totalCount).toBe(2);
    });

    //POST/blogs
    it('✅should create a blog', async () => {
        const createResponseBlog = await request(app.getHttpServer())
            .post('/api/blogs')
            .send({
                name: 'Test blog',
                description: 'Test description',
                websiteUrl: 'https://example.com',
            })
            .expect(201); //проверяет статус успешного создания

        //вернуть созданный блог
        expect(createResponseBlog.body).toEqual({
            id: expect.any(String),
            name: 'Test blog',
            description: 'Test description',
            websiteUrl: 'https://example.com',
            createdAt: expect.any(String),
            isMembership: false,
        });
    });

    //POST/blogs/blogId/posts
    it('✅should create a post by blog ID', async () => {
        const createResponseBlog = await request(app.getHttpServer())
            // Создаём блог
            .post('/api/blogs')
            .send({
                name: 'Test blog',
                description: 'Test description',
                websiteUrl: 'https://example.com',
            })
            .expect(201);

        const blogId = createResponseBlog.body.id;
        const blogName = createResponseBlog.body.name;

        const createResponsePost = await request(app.getHttpServer())
            // Создаём  пост
            .post(`/api/blogs/${blogId}/posts`)
            .send({
                title: 'Test post',
                shortDescription: 'Test shortDescription',
                content: 'Test content',
                blogId: blogId,
            })
            .expect(201);

        //вернуть созданный пост
        expect(createResponsePost.body).toEqual({
            id: expect.any(String),
            title: 'Test post',
            shortDescription: 'Test shortDescription',
            content: 'Test content',
            blogId: blogId,
            blogName: blogName,
            createdAt: expect.any(String),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: MyStatus.None,
                newestLikes: []
            }
        });
    });

    //PUT/blogs/id
    it('✅should update blog by ID', async () => {
        const createResponseBlog = await request(app.getHttpServer())
            // Создаём  блог
            .post('/api/blogs')
            .send({
                name: 'First blog',
                description: 'First description',
                websiteUrl: 'https://first.com',
            })
            .expect(201);

        //получаем ID
        const id = createResponseBlog.body.id;

        //обновляем блог по ID
        await request(app.getHttpServer())
            .put(`/api/blogs/${id}`)
            .send({
                name: 'Update blog',
                description: 'Update description',
                websiteUrl: 'https://firstUpdate.com',
            })
            .expect(204);

        //проверяем через GET что блог обновился 
        const response = await request(app.getHttpServer())
            .get(`/api/blogs/${id}`)
            .expect(200);

        expect(response.body.id).toBe(id);
        expect(response.body.name).toBe('Update blog');
        expect(response.body.description).toBe('Update description');
        expect(response.body.websiteUrl).toBe('https://firstUpdate.com');
    });


    //DELETE/blogs/id
    it('✅should delete blog by ID', async () => {
        const createResponseBlog = await request(app.getHttpServer())
            // Создаём  блог
            .post('/api/blogs')
            .send({
                name: 'First blog',
                description: 'First description',
                websiteUrl: 'https://first.com',
            })
            .expect(201);

        //получаем ID
        const id = createResponseBlog.body.id;

        //удаляем блог по ID
        await request(app.getHttpServer())
            .delete(`/api/blogs/${id}`)
            .expect(204);

        //проверяем через GET что блога уже не существует 
        await request(app.getHttpServer())
            .get(`/api/blogs/${id}`)
            .expect(404);
    });
});
