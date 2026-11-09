import { MyStatus } from "../../../blogs/domain/enum/comments-enum.myStatus.js";
import type { CommentDocument } from "../../domain/dto/comment-entity.js";

// Данные возвращаемые клиенту
export class CommentViewDto {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: Date;
    likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: MyStatus
    }

    static mapToView(comment: CommentDocument): CommentViewDto {
        const dto = new CommentViewDto();

        dto.id = comment._id.toString();
        dto.content = comment.content;
        dto.commentatorInfo = {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin,
        };
        dto.createdAt = comment.createdAt;
        dto.likesInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: MyStatus.None,
        };

        return dto;
    }
}
