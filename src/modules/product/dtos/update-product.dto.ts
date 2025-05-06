import { IsOptional } from "class-validator";

export class UpdateProductDto {
    @IsOptional()
    id: string;

    @IsOptional()
    name: string;

    @IsOptional()
    images: string[];

    @IsOptional()
    content: string;

    @IsOptional()
    tabs: Tab[];

    @IsOptional()
    size_stock: SizeStock[];

    @IsOptional()
    product_type: string; // name

    @IsOptional()
    product_form: string // name

    @IsOptional()
    wellness_need: string // name
}

class Tab {
    name: string;
    description: string;
}

class SizeStock {
    size: string;
    stock: number;
    price: number;
}