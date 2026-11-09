import { Injectable, NotFoundException} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Post, type PostDocument, type PostModelType } from "../domain/dto/post-entity.js";


@Injectable()
export class PostsRepository {
    //инжектирование модели через DI
    constructor(@InjectModel(Post.name) private PostModel: PostModelType) { }

      //Сохранение 
        async save(post: PostDocument) {
            await post.save();
        }

    // Удалить блог
    async deletePost(id: string): Promise<void> {
        const result = await this.PostModel.deleteOne({
            _id: id
        })

        if (result.deletedCount < 1) {
            throw new NotFoundException('Post not exist');
        }
    }
}