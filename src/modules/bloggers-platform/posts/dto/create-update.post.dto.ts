//Тут будут храниться dto, которые мы будем использовать для работы с сущностью user

export class CreatePostDto {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}

export class UpdatePostDto {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}