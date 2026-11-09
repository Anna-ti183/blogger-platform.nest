import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { PostsService } from "../application/posts-service.js";
import { PostsQueryRepository } from "../infrastucture/query/posts-query.repository.js";
import { CreatePostInputDto, UpdatePostInputDto } from "./input-dto.ts/posts-input.dto.js";
import { PostViewDto } from "./view-dto/posts-view.dto.js";
import { GetPostsCommentsQueryParams, GetPostsQueryParams } from "./input-dto.ts/get-posts-query-param.input-dto.js";
import { PaginatedViewDto } from "../../../../core/dto/base.paginated.view-dto.js";
import { CommentViewDto } from "../../comments/api/view-dto/comments-view.dto.js";
import { CommentsQueryRepository } from "../../comments/infrastucture/query/comments-query.repository.js";

@Controller('posts')
export class PostsController {
    constructor(
        private postsQueryRepository: PostsQueryRepository,
        private postsService: PostsService,
        private commentsQueryRepository: CommentsQueryRepository
    ) { }

    //GET/posts
    @Get()
    async getAll(
        @Query() query: GetPostsQueryParams,
    ): Promise<PaginatedViewDto<PostViewDto[]>> {
        return await this.postsQueryRepository.getAll(query);
    }


    //GET/posts/id
    @Get(':id')
    async getById(@Param('id') id: string): Promise<PostViewDto> {
        return await this.postsQueryRepository.getByIdOrNotFoundFail(id);
        
    }

    //GET/posts/postId/comments
    @Get(':postId/comments')
    async getByPostComments(
        @Param('postId') postId: string,
        @Query() query: GetPostsCommentsQueryParams
    ): Promise <PaginatedViewDto<CommentViewDto[]>> {
        await this.postsQueryRepository.findOrNotFoundFail(postId);
        return this.commentsQueryRepository.getPostIdComments(postId, query)
    }

    //POST/posts
    @Post()
    async createPost(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
        const postId = await this.postsService.createPost(body);

        return this.postsQueryRepository.getByIdOrNotFoundFail(postId)
    }


    //PUT/posts/id
    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updatePost(
        @Param('id') id: string,
        @Body() body: UpdatePostInputDto,
    ): Promise <void> {
        await this.postsService.updatePost(id, body)
    }

    //DELETE/posts/id
     @Delete(':id')
        @HttpCode(HttpStatus.NO_CONTENT)
        async deletePost(@Param('id') id: string): Promise<void> {
            return this.postsService.deletePost(id);
        }
}