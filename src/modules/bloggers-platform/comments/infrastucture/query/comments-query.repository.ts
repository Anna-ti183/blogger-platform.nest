import { InjectModel } from "@nestjs/mongoose";
import { Comment, type CommentModelType } from "../../domain/dto/comment-entity.js";
import { CommentViewDto } from "../../api/view-dto/comments-view.dto.js";
import {  NotFoundException } from "@nestjs/common";
import { GetPostsCommentsQueryParams } from "../../../posts/api/input-dto.ts/get-posts-query-param.input-dto.js";
import { PaginatedViewDto } from "../../../../../core/dto/base.paginated.view-dto.js";
import { QueryFilter } from "mongoose";


export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
  ) { }

    //Найти коммент или выбросить ошибку + готовая модель для ответа клиенту
    async getByIdOrNotFoundFail(id: string): Promise<CommentViewDto> {
      const comment = await this.CommentModel.findOne({
        _id: id,
      });
  
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }
  
      return CommentViewDto.mapToView(comment);
    }

    // Найти все комментарии 1 поста
      async getPostIdComments(
        postId: string,
        query: GetPostsCommentsQueryParams,
      ): Promise<PaginatedViewDto<CommentViewDto[]>> {
        const filter: QueryFilter<Comment> = {
          postId: postId
        };
    
        const commentsOnePost = await this.CommentModel.find(filter)
          .sort({ [query.sortBy]: query.sortDirection })
          .skip(query.calculateSkip())
          .limit(query.pageSize);
    
        const totalCount = await this.CommentModel.countDocuments(filter);
    
        const items = commentsOnePost.map(CommentViewDto.mapToView);
    
        //формируем окончательный объект ответа с пагинацией, который вернём клиенту
        return PaginatedViewDto.mapToView({
          items,
          totalCount,
          page: query.pageNumber,
          size: query.pageSize,
        });
      }
}