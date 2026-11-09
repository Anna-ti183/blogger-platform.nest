import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { CreatePostDto, UpdatePostDto } from "../../dto/create-update.post.dto.js";

/**
 * Post Entity Schema
 * Этот класс описывает схему и поведение сущности «Blog»
 */
@Schema({ timestamps: true })
export class Post {
    /**
       * Title 
       * @type {string}
       * @required
       */

    @Prop({ type: String, required: true, maxlength: 30  })
    title: string;

    /**
     * ShortDescription
     * @type {string}
     * @required
     */
    @Prop({ type: String, required: true, maxlength: 100 })
    shortDescription: string;

     /**
     * Content
     * @type {string}
     * @required
     */
    @Prop({ type: String, required: true, maxlength: 1000 })
    content: string;

     /**
     * BlogId
     * @type {string}
     * @required
     */
    @Prop({ type: String, required: true })
    blogId: string;

     /**
     * BlogName
     * @type {string}
     * @required
     */
    @Prop({ type: String, required: true })
    blogName: string;

     /**
     * Creation timestamp
     * Явно определено, несмотря на timestamps: true
     * свойства без @Prop в TypeScript — чтобы они находились в экземпляре класса (или были доступны в методах экземпляра)
     * @type {Date}
     */
    createdAt: Date;
    updatedAt: Date;

    //static createInstance() — это статический метод класса, который создаёт новый экземпляр поста.
        // Он нужен для того чтобы централизованно создавать посты и заполнять их начальными данными
        static createInstance(dto: CreatePostDto): PostDocument {
            const post = new this();
            post.title = dto.title;
            post.shortDescription = dto.shortDescription;
            post.content = dto.content;
            post.blogId = dto.blogId;
            post.blogName = dto.blogName
    
            return post as PostDocument;
        }

        update(dto: UpdatePostDto){
            this.title = dto.title;
            this.shortDescription = dto.shortDescription;
            this.content = dto.content;
            this.blogId = dto.blogId;
            this.blogName = dto.blogName
        }

}
//создает схему на основе класса
export const PostSchema = SchemaFactory.createForClass(Post);

//регистрирует наши методы в схеме монгуcа
PostSchema.loadClass(Post);

//Типизация документа
export type PostDocument = HydratedDocument<Post>;

//типизация модели со статическими и инстанс методами.
export type PostModelType = Model<PostDocument> & typeof Post;