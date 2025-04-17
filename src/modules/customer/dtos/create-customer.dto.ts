export class CreateCustomerDto {
    name: string;
    mail: string;
    password: string;
    phone?: string;
    addresses?: object;
}