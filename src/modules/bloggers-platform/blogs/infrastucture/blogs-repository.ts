import { Injectable, NotFoundException } from "@nestjs/common";
import { Blog, BlogDocument } from "../domain/dto/blog-entity.js";
import { InjectModel } from "@nestjs/mongoose";
import type { BlogModelType } from "../domain/dto/blog-entity.js";
import { BlogViewDto } from "../api/view-dto/blogs-view.dto.js";

@Injectable()
export class BlogsRepository {
    //инжектирование модели через DI
    constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) { }

    //Сохранение 
    async save(blog: BlogDocument) {
        await blog.save();
    }

    // Удалить блог 
    async deleteBlog(id: string): Promise<void> {
        const result = await this.BlogModel.deleteOne({
            _id: id
        })

        if (result.deletedCount < 1) {
            throw new NotFoundException('Blog not exist');
        }
    }





}