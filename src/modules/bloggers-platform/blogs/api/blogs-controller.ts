import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { BlogsService } from '../application/blogs-service.js';

import { BlogsQueryRepository } from '../infrastucture/query/blogs-query.repository.js';
import { BlogViewDto } from './view-dto/blogs-view.dto.js';
import { BlogsRepository } from '../infrastucture/blogs-repository.js';
import { CreateBlogInputDto, UpdateBlogInputDto } from './input-dto/blogs-input.dto.js';
import { GetBlogsPostsQueryParams, GetBlogsQueryParams } from './input-dto/get-blogs-query-param.input-dto.js';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto.js';
import { CreateBlogPostInputDto } from './input-dto/create-blog-post-input.dto.js';
import { PostViewDto } from '../../posts/api/view-dto/posts-view.dto.js';
import { PostsService } from '../../posts/application/posts-service.js';
import { PostsQueryRepository } from '../../posts/infrastucture/query/posts-query.repository.js';

@Controller('blogs')
export class BlogsController {
    constructor(
        private blogsQueryRepository: BlogsQueryRepository,
        private blogsRepository: BlogsRepository,
        private blogsService: BlogsService,
        private postService: PostsService,
        private postsQueryRepository: PostsQueryRepository
    ) { }

    //GET/blogs
    @Get()
    async getAll(
        @Query() query: GetBlogsQueryParams,
    ): Promise<PaginatedViewDto<BlogViewDto[]>> {
        return this.blogsQueryRepository.getAll(query);
    }

    //GET/blogs/id
    @Get(':id')
    async getById(@Param('id') id: string): Promise<BlogViewDto> {
        return this.blogsQueryRepository.getByIdOrNotFoundFail(id);
    }

    //GET/blogs/blogId/posts
    @Get(':blogId/posts')
    async getByBlogPost(
        @Param('blogId') blogId: string,
        @Query() query: GetBlogsPostsQueryParams
    ): Promise<PaginatedViewDto<PostViewDto[]>> {
        await this.blogsQueryRepository.findOrNotFoundFail(blogId);
        return await this.postsQueryRepository.getBlogIdPosts(blogId, query)
    }

    //POST/blogs
    @Post()
    async createBlog(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
        const blogId = await this.blogsService.createBlog(body);
        return this.blogsQueryRepository.getByIdOrNotFoundFail(blogId)
    }

    //POST/blogs/blogId/posts
    @Post(':blogId/posts')
    async createBlogPost(
        @Param('blogId') blogId: string,
        @Body() body: CreateBlogPostInputDto,
    ): Promise<PostViewDto> {
        const postId = await this.postService.createBlogPost(blogId, body);
        return await this.postsQueryRepository.getByIdOrNotFoundFail(postId)
    }


    //PUT/blogs/id
    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateBlog(
        @Param('id') id: string,
        @Body() body: UpdateBlogInputDto,
    ): Promise<void> {
        await this.blogsService.updateBlog(id, body)
    }

    //DELETE/blogs/id
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlog(@Param('id') id: string): Promise<void> {
        return this.blogsService.deleteBlog(id);
    }

}



