import { Controller, Get, Param } from "@nestjs/common";
import { CommentsQueryRepository } from "../infrastucture/query/comments-query.repository.js";
import { CommentViewDto } from "./view-dto/comments-view.dto.js";

@Controller('comments')
export class CommentsController {
    constructor(
        private commentsQueryRepository: CommentsQueryRepository,
       // private postsQueryRepository: PostsQueryRepository
    ) { }

      //GET/blogs/id
        @Get(':id')
        async getById(@Param('id') id: string): Promise<CommentViewDto> {
            return this.commentsQueryRepository.getByIdOrNotFoundFail(id);
        }
}