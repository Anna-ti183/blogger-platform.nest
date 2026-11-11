import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module.js";
import { appSetup } from "../src/setup/app.setup.js";
import request = require('supertest');
import { MyStatus } from "../src/modules/bloggers-platform/posts/domain/enum/posts-enum.myStatus.js";

describe('PostsController (e2e)', () => {
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

    //GET/posts
    it('✅ should return all posts', async () => {
        const createResponseBlog = await request(app.getHttpServer())
            // Создаём блог
            .post('/api/blogs')
            .send({
                name: 'First blog',
                description: 'First description',
                websiteUrl: 'https://first.com',
            })
            .expect(201);

        const id = createResponseBlog.body.id;

        // Создаём первый пост
        await request(app.getHttpServer())
            .post('/api/posts')
            .send({
                title: 'Test1 post',
                shortDescription: 'Test1 shortDescription',
                content: 'Test1 content',
                blogId: id,
            })
            .expect(201);

        // Создаём второй пост
        await request(app.getHttpServer())
            .post('/api/posts')
            .send({
                title: 'Test2 post',
                shortDescription: 'Test2 shortDescription',
                content: 'Test2 content',
                blogId: id,
            })
            .expect(201);

        // Получаем все посты
        const response = await request(app.getHttpServer())
            .get('/api/posts')
            .expect(200);

        expect(response.body.items).toHaveLength(2);

        //сортировка по умолчанию идёт по createdAt в порядке убывания (DESC), поэтому последний созданный блог должен быть первым
        expect(response.body.items[0].title).toBe('Test2 post');
        expect(response.body.items[1].title).toBe('Test1 post');

        expect(response.body.totalCount).toBe(2);
    })

    //GET/posts/id
    it('✅should return a post by ID', async () => {
        const createResponseBlog = await request(app.getHttpServer()) //обращаемся к запущенному Nest-приложению. Это как отправить запрос через Postman.
            // Создаём  блог
            .post('/api/blogs')
            .send({
                name: 'First blog',
                description: 'First description',
                websiteUrl: 'https://first.com',
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

        //получаем ID поста
        const id = createResponsePost.body.id;

        //Получаем пост по ID
        const response = await request(app.getHttpServer())
            .get(`/api/posts/${id}`)
            .expect(200);

        expect(response.body.id).toBe(id); //проверка: ID полученного блога совпадает с ID того блога, который мы создали
        expect(response.body.title).toBe('Test post'); //проверка: имя блога действительно First blog
    });
    /*
            //GET/posts/postId/comments
            it('✅ should return all comments by Post', async () => {
    
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
    
                const createResponsePost = await request(app.getHttpServer())
                    // Создаём пост
                    .post('/api/posts')
                    .send({
                        title: 'Test1 post',
                        shortDescription: 'Test1 shortDescription',
                        content: 'Test1 content',
                        blogId: blogId,
                    })
                    .expect(201);
    
                const postId = createResponsePost.body.id;
    
                // Создаём первый комментарий
                await request(app.getHttpServer())
                    .post(`/api/posts/${postId}/comments`)
                    .send({
                        content: 'Test1 content',
                    })
                    .expect(201);
    
                // Создаём второй комментарий
                await request(app.getHttpServer())
                    .post(`/api/posts/${postId}/comments`)
                    .send({
                        content: 'Test2 content',
                    })
                    .expect(201);
    
                // Получаем все комментарии
                const response = await request(app.getHttpServer())
                    .get(`/api/posts/${postId}/comments`)
                    .expect(200);
    
                expect(response.body.items).toHaveLength(2);
    
                expect(response.body.items[0].content).toBe('Test2 content');
                expect(response.body.items[1].content).toBe('Test1 content');
    
                expect(response.body.totalCount).toBe(2);
            });
    
    */
    //POST/posts
    it('✅should create a post', async () => {
        const createResponseBlog = await request(app.getHttpServer()) //обращаемся к запущенному Nest-приложению. Это как отправить запрос через Postman.
            // Создаём  блог
            .post('/api/blogs')
            .send({
                name: 'First blog',
                description: 'First description',
                websiteUrl: 'https://first.com',
            })
            .expect(201);

        //получаем ID блога
        const idBlog = createResponseBlog.body.id;
        const blogName = createResponseBlog.body.name;


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

        //вернуть созданный блог
        expect(createResponsePost.body).toEqual({
            id: expect.any(String),
            title: 'Test post',
            shortDescription: 'Test shortDescription',
            content: 'Test content',
            blogId: idBlog,
            blogName: blogName,
            createdAt: expect.any(String),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: MyStatus.None,
                newestLikes: []
            }
        })
    });

    //PUT/posts/id
    it('✅should update post by ID', async () => {
        // Создаём  блог
        const createResponseBlog = await request(app.getHttpServer())
            .post('/api/blogs')
            .send({
                name: 'First blog',
                description: 'First description',
                websiteUrl: 'https://first.com',
            })
            .expect(201);

        //получаем ID
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

        const id = createResponsePost.body.id;

        //обновляем пост по ID
        await request(app.getHttpServer())
            .put(`/api/posts/${id}`)
            .send({
                title: 'Update post',
                shortDescription: 'Update shortDescription',
                content: 'Update content',
                blogId: idBlog,
            })
            .expect(204);

        //проверяем через GET что пост обновился 
        const response = await request(app.getHttpServer())
            .get(`/api/posts/${id}`)
            .expect(200);

        expect(response.body.id).toBe(id);
        expect(response.body.title).toBe('Update post');
        expect(response.body.shortDescription).toBe('Update shortDescription');
        expect(response.body.content).toBe('Update content');
    });

    //DELETE/posts/id
    it('✅should delete post by ID', async () => {
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

        const id = createResponsePost.body.id;

        //удаляем пост по ID
        await request(app.getHttpServer())
            .delete(`/api/posts/${id}`)
            .expect(204);

        //проверяем через GET что поста уже не существует 
        await request(app.getHttpServer())
            .get(`/api/posts/${id}`)
            .expect(404);
    });
});