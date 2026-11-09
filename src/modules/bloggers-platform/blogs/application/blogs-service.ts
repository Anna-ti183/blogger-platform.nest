import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/dto/blog-entity.js';
import { BlogsRepository } from '../infrastucture/blogs-repository.js';
import type { BlogModelType } from '../domain/dto/blog-entity.js';
import { UpdateBlogDto } from '../../dto/create-update.blog.dto.js';
import { CreateBlogDomainDto } from '../domain/dto/create-blog.domain.dto.js';
import { BlogsQueryRepository } from '../infrastucture/query/blogs-query.repository.js';

@Injectable()
export class BlogsService {
    constructor(
        //инжектирование модели в сервис через DI
        @InjectModel(Blog.name)
        private BlogModel: BlogModelType,
        private blogsRepository: BlogsRepository, 
        private blogsQueryRepository: BlogsQueryRepository
    ) { }

    //POST/blogs
    //createInstance - фабричный метод=>создаёт новый экземпляр сущности(Entity)+заполняет его начальными данными
    async createBlog(dto: CreateBlogDomainDto): Promise<string> {
     
        const blog = this.BlogModel.createInstance({
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            //isMembership не нужно, оно автоматически добавится в Blog Entity
        });

        await this.blogsRepository.save(blog);

        return blog._id.toString();
    }

    //PUT/blogs/id
    async updateBlog(id: string, dto: UpdateBlogDto): Promise<void> {
        const blog = await this.blogsQueryRepository.findOrNotFoundFail(id)

        blog.update(dto);

        await this.blogsRepository.save(blog);

    }

    //DELETE/blogs/id  
    async deleteBlog(id: string): Promise<void> {

        await this.blogsRepository.deleteBlog(id)
    }
}
