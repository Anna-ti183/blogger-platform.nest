import { BaseQueryParams } from "../../../../../core/dto/base.query-params.input-dto.js";
import { PostsCommentsSortBy, PostsSortBy } from "./posts-sort-by.js";

export class GetPostsQueryParams extends BaseQueryParams {
    sortBy = PostsSortBy.CreatedAt;
    searchBlogIdTerm: string | null = null;
    searchBlogNameTerm: string | null = null;
    searchTitleTerm: string | null = null;
    searchShortDescriptionTerm: string | null = null;
}

export class GetPostsCommentsQueryParams extends BaseQueryParams {
  sortBy = PostsCommentsSortBy.CreatedAt;
}

