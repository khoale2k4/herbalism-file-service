import { IsOptional } from "class-validator";

export class CreateOrderFromCartDto {
    customerId: string;
    destination: string;
}