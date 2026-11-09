import { CreatePostDomainDto, UpdatePostDomainDto } from "../../domain/dto/create-post.domain.dto.js";

export class CreatePostInputDto implements CreatePostDomainDto{
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;  
}

export class UpdatePostInputDto implements UpdatePostDomainDto {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;  
}