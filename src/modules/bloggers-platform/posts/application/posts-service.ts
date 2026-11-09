import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { PostModelType } from "../domain/dto/post-entity.js";
import { PostsRepository } from "../infrastucture/posts-repository.js";
import { CreateBlogPostDomainDto, CreatePostDomainDto, UpdatePostDomainDto } from "../domain/dto/create-post.domain.dto.js";
import { BlogsRepository } from "../../blogs/infrastucture/blogs-repository.js";
import { Post } from "../domain/dto/post-entity.js";
import { UpdatePostDto } from "../dto/create-update.post.dto.js";
import { PostsQueryRepository } from "../infrastucture/query/posts-query.repository.js";
import { BlogsQueryRepository } from "../../blogs/infrastucture/query/blogs-query.repository.js";

@Injectable()



export class PostsService {
    constructor(
        //инжектирование модели в сервис через DI
        @InjectModel(Post.name)
        private PostModel: PostModelType,
        private postsRepository: PostsRepository,
        private blogsQueryRepository: BlogsQueryRepository,
        private postsQueryRepository: PostsQueryRepository
    ) { }

    //POST/posts
    async createPost(dto: CreatePostDomainDto): Promise<string> {
        const blog = await this.blogsQueryRepository.findOrNotFoundFail(dto.blogId)
        const post = this.PostModel.createInstance({
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName: blog.name
        })
        await this.postsRepository.save(post)

        return post._id.toString()
    }

    //POST/blogs/blogId/posts
    async createBlogPost(blogId: string, dto: CreateBlogPostDomainDto): Promise<string> {
        const blog = await this.blogsQueryRepository.findOrNotFoundFail(blogId);
        const post = this.PostModel.createInstance({
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: blogId,
            blogName: blog.name
        })
        await this.postsRepository.save(post)

        return post._id.toString()
    }

    //PUT/posts/id
    async updatePost(id: string, dto: UpdatePostDomainDto): Promise<void> {
        const blog = await this.blogsQueryRepository.findOrNotFoundFail(dto.blogId);
        const post = await this.postsQueryRepository.findOrNotFoundFail(id);

        post.update({
            ...dto,
            blogName: blog.name
        });

        await this.postsRepository.save(post);
    }

    //DELETE/posts/id
    async deletePost(id: string): Promise<void> {
        await this.postsRepository.deletePost(id)
    }
}