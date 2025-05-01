import { IsOptional } from "class-validator";

export class CreateAddressDto {
    @IsOptional()
    firstName: string;
    @IsOptional()
    lastName: string;
    @IsOptional()
    address: string;
    @IsOptional()
    country: string;
    @IsOptional()
    apartment?: string;
    @IsOptional()
    city: string;
    @IsOptional()
    province: string;
    @IsOptional()
    zipCode: string;
}