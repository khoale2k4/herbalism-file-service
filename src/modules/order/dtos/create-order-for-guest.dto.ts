import { IsOptional } from "class-validator";
import { CreateAddressDto } from "src/modules/customer/dtos/create-address.dto";

export class CreateOrderForGuestDto {
    @IsOptional()
    items: OrderItemDto[];
    @IsOptional()
    voucherId?: string;
    @IsOptional()
    paymentMethod: 'cod' | 'bank';
    @IsOptional()
    address: CreateAddressDto
}

export type OrderItemDto = {
    productId: string;
    size: string;
    quantity: number;
}