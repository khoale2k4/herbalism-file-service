import { IsOptional } from "class-validator";

export class CreateVoucherDto {
    @IsOptional()
    id: string;

    @IsOptional()
    discount: number;

    @IsOptional()
    type: "amount" | "percent";
}