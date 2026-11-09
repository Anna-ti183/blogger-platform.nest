import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";

/**
 * Схема вложенного объекта в COMMENT
 */
@Schema({ _id: false }) // id нам тут не нужно, потому что этот объект будет внутри нашего COMMENT
export class CommentatorInfo {
    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: String, required: true })
    userLogin: string;
}

export const CommentatorInfoSchema =
    SchemaFactory.createForClass(CommentatorInfo);


/**
 * COMMENT ENTITY SCHEMA
 */
@Schema({ timestamps: true })
export class Comment {

    @Prop({ type: String, required: true })
    content: string;

    @Prop({ type: String, required: true })
    postId: string;

    @Prop({ type: CommentatorInfoSchema, required: true })
    commentatorInfo: CommentatorInfo;

    createdAt: Date;
    updatedAt: Date;

}

//создает схему на основе класса
export const CommentSchema = SchemaFactory.createForClass(Comment);

//регистрирует наши методы в схеме монгуcа
CommentSchema.loadClass(Comment);

//Типизация документа
export type CommentDocument = HydratedDocument<Comment>;

//типизация модели со статическими и инстанс методами.
export type CommentModelType = Model<CommentDocument> & typeof Comment;