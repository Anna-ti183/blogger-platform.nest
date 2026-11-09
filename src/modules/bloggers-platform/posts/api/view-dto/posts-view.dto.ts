import { PostDocument } from "../../domain/dto/post-entity.js";
import { MyStatus } from "../../domain/enum/posts-enum.myStatus.js";

// Данные возвращаемые клиенту
export class PostViewDto {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: MyStatus;
        newestLikes: {
            addedAt: Date; 
            userId: string; 
            login: string
        }[]
    }

    static mapToView(post: PostDocument): PostViewDto {
        const dto = new PostViewDto();

        dto.id = post._id.toString();
        dto.title = post.title;
        dto.shortDescription = post.shortDescription;
        dto.content = post.content;
        dto.blogId = post.blogId;
        dto.blogName = post.blogName
        dto.createdAt = post.createdAt;
        dto.extendedLikesInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: MyStatus.None,
            newestLikes: []
        }
        return dto;
    }
} 