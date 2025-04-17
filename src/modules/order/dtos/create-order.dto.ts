import { IsOptional } from "class-validator";

export class CreateOrderDto {
    @IsOptional()
    items: OrderItemDto[];
    @IsOptional()
    destination: string;
    @IsOptional()
    inCart: boolean;
}

export type OrderItemDto = {
    productId: string;
    size: string;
    quantity: number;
}