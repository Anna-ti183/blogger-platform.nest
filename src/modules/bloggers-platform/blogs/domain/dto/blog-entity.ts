import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { CreateBlogDomainDto } from "./create-blog.domain.dto.js";
import { HydratedDocument, Model } from "mongoose";
import { UpdateBlogDto } from "../../../dto/create-update.blog.dto.js";

/**
 * Blog Entity Schema
 * Этот класс описывает схему и поведение сущности «Blog»
 */
@Schema({ timestamps: true })
export class Blog {
    /**
       * Name 
       * @type {string}
       * @required
       */

    @Prop({ type: String, required: true, maxlength: 15 })
    name: string;

    /**
     * Description
     * @type {string}
     * @required
     */
    @Prop({ type: String, required: true, maxlength: 500 })
    description: string;

    /**
     * WebsiteUrl
     * @type {string}
     * @required
     */
    @Prop({ type: String, 
        required: true, 
        maxlength: 100,
        match: /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
     })
    websiteUrl: string;

    /**
    * IsMembership
    * @type {boolean}
    */
    @Prop({ default: false })
    isMembership: boolean;

    /**
     * Creation timestamp
     * Явно определено, несмотря на timestamps: true
     * свойства без @Prop в TypeScript — чтобы они находились в экземпляре класса (или были доступны в методах экземпляра)
     * @type {Date}
     */
    createdAt: Date;
    updatedAt: Date;

    //static createInstance() — это статический метод класса, который создаёт новый экземпляр блога.
    // Он нужен для того чтобы централизованно создавать блоги и заполнять их начальными данными
    static createInstance(dto: CreateBlogDomainDto): BlogDocument {
        const blog = new this();
        blog.name = dto.name;
        blog.description = dto.description;
        blog.websiteUrl = dto.websiteUrl;
        blog.isMembership = false

        return blog as BlogDocument;
    }

    update(dto: UpdateBlogDto) {
        this.name = dto.name;
        this.description = dto.description;
        this.websiteUrl = dto.websiteUrl;
    }
}

//создает схему на основе класса
export const BlogSchema = SchemaFactory.createForClass(Blog);

//регистрирует наши методы в схеме монгуcа
BlogSchema.loadClass(Blog);

//Типизация документа
export type BlogDocument = HydratedDocument<Blog>;

//типизация модели со статическими и инстанс методами.
export type BlogModelType = Model<BlogDocument> & typeof Blog;
