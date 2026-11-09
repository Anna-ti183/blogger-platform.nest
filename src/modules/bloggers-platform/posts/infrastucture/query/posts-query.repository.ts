import { InjectModel } from "@nestjs/mongoose";
import { Post, PostDocument, type PostModelType } from "../../domain/dto/post-entity.js";
import { NotFoundException } from "@nestjs/common";
import { PostViewDto } from "../../api/view-dto/posts-view.dto.js";
import { GetPostsQueryParams } from "../../api/input-dto.ts/get-posts-query-param.input-dto.js";
import { PaginatedViewDto } from "../../../../../core/dto/base.paginated.view-dto.js";
import { QueryFilter } from "mongoose";
import { GetBlogsPostsQueryParams } from "../../../blogs/api/input-dto/get-blogs-query-param.input-dto.js";

export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
  ) { }

  //Найти пост или выбросить ошибку + готовая модель для ответа клиенту
  async getByIdOrNotFoundFail(id: string): Promise<PostViewDto> {
    const post = await this.PostModel.findOne({
      _id: id,
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return PostViewDto.mapToView(post);
  }

  //Найти блог или выбросить ошибку
  async findOrNotFoundFail(id: string): Promise<PostDocument> {
    const post = await this.findById(id);

    if (!post) {
      //TODO: replace with domain exception
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  //Найти блог по ID
  async findById(id: string): Promise<PostDocument | null> {
    return this.PostModel.findOne({
      _id: id,
    });
  }

  // Найти все посты 
  async getAll(
    query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const filter: QueryFilter<Post> = {};


    if (query.searchTitleTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        title: { $regex: query.searchTitleTerm, $options: 'i' },
      });
    }

    if (query.searchShortDescriptionTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        shortDescription: { $regex: query.searchShortDescriptionTerm, $options: 'i' },
      });
    }

    if (query.searchBlogNameTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        blogName: { $regex: query.searchBlogNameTerm, $options: 'i' },
      });
    }

    //найти посты, принадлежащие конкретному блогу с таким ID
    if (query.searchBlogIdTerm) {
      filter.blogId =  query.searchBlogIdTerm
    }

    const posts = await this.PostModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.PostModel.countDocuments(filter);

    const items = posts.map(PostViewDto.mapToView);

    //формируем окончательный объект ответа с пагинацией, который вернём клиенту
    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }


  // Найти все посты 1 блога 
  async getBlogIdPosts(
    blogId: string,
    query: GetBlogsPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const filter: QueryFilter<Post> = {
      blogId: blogId
    };

    const postsOneBlog = await this.PostModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.PostModel.countDocuments(filter);

    const items = postsOneBlog.map(PostViewDto.mapToView);

    //формируем окончательный объект ответа с пагинацией, который вернём клиенту
    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

}
