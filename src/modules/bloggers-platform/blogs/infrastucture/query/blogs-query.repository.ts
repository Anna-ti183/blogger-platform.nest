import { InjectModel } from "@nestjs/mongoose";
import { Blog } from "../../domain/dto/blog-entity.js";
import type { BlogDocument, BlogModelType } from "../../domain/dto/blog-entity.js";
import { NotFoundException } from "@nestjs/common";
import { BlogViewDto } from "../../api/view-dto/blogs-view.dto.js";
import { GetBlogsQueryParams } from "../../api/input-dto/get-blogs-query-param.input-dto.js";
import { PaginatedViewDto } from "../../../../../core/dto/base.paginated.view-dto.js";
import { QueryFilter } from "mongoose";

export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
  ) { }

  //Найти блог или выбросить ошибку
  async findOrNotFoundFail(id: string): Promise<BlogDocument> {
    const blog = await this.findById(id);

    if (!blog) {
      //TODO: replace with domain exception
      throw new NotFoundException('blog not found');
    }

    return blog;
  }

  //Найти блог по ID
  async findById(id: string): Promise<BlogDocument | null> {
    return this.BlogModel.findOne({
      _id: id,
    });
  }

  //Найти блог или выбросить ошибку + готовая модель для ответа клиенту
  async getByIdOrNotFoundFail(id: string): Promise<BlogViewDto> {
    const blog = await this.BlogModel.findOne({
      _id: id,
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return BlogViewDto.mapToView(blog);
  }

  // Найти все блоги 
  async getAll(
    query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    const filter: QueryFilter<Blog> = {};

    //Проверяем, передал ли клиент параметр searchNameTerm
    if (query.searchNameTerm) {
      //filter.$or — массив условий поиска => || [] — если массива нет, создаём. Если массив существует, оставляем его.
      filter.$or = filter.$or || [];
      //Добавляем условие поиска по полю name
      filter.$or.push({
        //name — поле документа Blog, по которому ищем
        //$regex — оператор MongoDB для поиска по регулярному выражению
        //query.searchNameTerm — текст, который ввёл пользователь
        //$options: 'i' — поиск без учёта регистра
        name: { $regex: query.searchNameTerm, $options: 'i' },
      });
    }

    if (query.searchDescriptionTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        description: { $regex: query.searchDescriptionTerm, $options: 'i' },
      });
    }

    //this.BlogModel — Mongoose-модель Blog, через которую мы обращаемся к коллекции блогов.
    //.find(filter) — ищет все документы, которые соответствуют нашему фильтру.
    const blogs = await this.BlogModel.find(filter)
      //Сортируем найденные блоги
      //query.sortBy — поле, по которому сортируем (createdAt, name, description).
      //query.sortDirection — направление сортировки (asc или desc).
      .sort({ [query.sortBy]: query.sortDirection })
      //Определяет, сколько документов нужно пропустить перед получением текущей страницы.
      .skip(query.calculateSkip())
      //Ограничение количества документов
      .limit(query.pageSize);

      //подсчёт общего количества найденных блогов.
    const totalCount = await this.BlogModel.countDocuments(filter);

    //преобразует найденные документы MongoDB в DTO, которые мы будем возвращать клиенту
    const items = blogs.map(BlogViewDto.mapToView);

    //формируем окончательный объект ответа с пагинацией, который вернём клиенту
    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

}