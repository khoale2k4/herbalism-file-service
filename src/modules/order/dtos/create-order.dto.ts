import { IsOptional } from "class-validator";

export class CreateOrderDto {
    customerId: string;
    items: OrderItemDto[];
    destination: string;
    inCart: boolean;
}

export type OrderItemDto = {
    productId: string;
    size: string;
    quantity: number;
}