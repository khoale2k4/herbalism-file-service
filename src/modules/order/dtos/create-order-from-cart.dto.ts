import { IsOptional } from "class-validator";

export class CreateOrderFromCartDto {
    customerId: string;
    addressId: string;
}