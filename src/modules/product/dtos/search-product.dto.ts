import { IsOptional, IsString } from 'class-validator';

export class SearchProductsDto {
    @IsOptional()
    @IsString()
    form?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    need?: string;
}