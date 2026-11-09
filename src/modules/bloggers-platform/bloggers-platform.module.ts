import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs-controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/domain/dto/blog-entity.js';
import { BlogsService } from './blogs/application/blogs-service.js';
import { BlogsQueryRepository } from './blogs/infrastucture/query/blogs-query.repository.js';
import { BlogsRepository } from './blogs/infrastucture/blogs-repository.js';
import { PostsController } from './posts/api/posts-controller.js';
import { PostsService } from './posts/application/posts-service.js';
import { PostsRepository } from './posts/infrastucture/posts-repository.js';
import { PostsQueryRepository } from './posts/infrastucture/query/posts-query.repository.js';
import { Post, PostSchema } from './posts/domain/dto/post-entity.js';
import { Comment, CommentSchema } from './comments/domain/dto/comment-entity.js';
import { CommentsController } from './comments/api/commets-controller.js';
import { CommentsQueryRepository } from './comments/infrastucture/query/comments-query.repository.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsService, BlogsQueryRepository, BlogsRepository,
    PostsService, PostsRepository, PostsQueryRepository,
    CommentsQueryRepository]
})
export class BloggersPlatformModule { }
