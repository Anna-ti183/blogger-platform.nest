import { CreateBlogDomainDto } from "../../domain/dto/create-blog.domain.dto.js";

export class CreateBlogInputDto implements  CreateBlogDomainDto {
  name: string;
  description: string;
  websiteUrl: string;
}

export class UpdateBlogInputDto {
  name: string;
  description: string;
  websiteUrl: string;
}
