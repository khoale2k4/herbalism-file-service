import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { Customer } from '../../shared/database/models/customer.model';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UUID } from 'crypto';
import { AdminService } from '../admin/admin.service';
import { Address } from 'src/shared/database/models/address.model';
import { CreateAddressDto } from './dtos/create-address.dto';

@Injectable()
export class CustomerService {
    constructor(
        @InjectModel(Customer) private customerModel: typeof Customer,
        @InjectModel(Address) private addressModel: typeof Address,
        private adminService: AdminService
    ) { }

    async getInfo(cusId: number) {
        return await this.customerModel.findByPk(cusId);
    }

    async findByEmail(email: string) {
        const result = await this.customerModel.findOne({
            where: { mail: email },
        });
        return result?.dataValues;
    }

    async findById(id: string) {
        const result = await this.customerModel.findByPk(id);
        console.log(id, result);
        return result;
    }

    async hashPassword(password: string) {
        const saltRounds = parseInt(process.env.SALT_ROUNDS ?? "10", 10);
        const hash = await bcrypt.hash(password, saltRounds);
        console.log("Hashing password:", password, "->", hash);
        return hash;
    }

    async create(customerData: CreateCustomerDto) {
        const { password, ...dataWithouPassword } = customerData;
        console.log({
            ...dataWithouPassword,
            password: await this.hashPassword(password),
        });
        return await this.customerModel.create({
            ...dataWithouPassword,
            password: await this.hashPassword(password),
        });
    }

    async findAll(adminId: string) {
        const isAdmin = await this.adminService.findByPk(adminId);
        if (!isAdmin) return null;
        return await this.customerModel.findAll();
    }

    async addAddress(customerId: string, dto: CreateAddressDto) {
        return await this.addressModel.create({
            customerId,
            ...dto
        })
    }

    async getAddress(customerId: string) {
        return await this.addressModel.findAll({
            where: {
                customerId
            }
        })
    }
}