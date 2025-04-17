import { IsOptional } from "class-validator";

export class CreateArticleDto {
    @IsOptional()
    title: string;
    @IsOptional()
    content: string;
    @IsOptional()
    shortDescription: string;
    @IsOptional()
    images: string[];
    @IsOptional()
    category: string;
};