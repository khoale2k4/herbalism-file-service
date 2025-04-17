
import { Injectable } from '@nestjs/common';
import { Customer } from '../../shared/database/models/customer.model';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UUID } from 'crypto';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class CustomerService {
    constructor(
        @InjectModel(Customer)
        private customerModel: typeof Customer,
        private adminService: AdminService
    ) { }
    
    async getInfo(cusId: number) {
        return this.customerModel.findByPk(cusId);
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
    

    async create(customerData: CreateCustomerDto): Promise<Customer> {
        return this.customerModel.create(customerData as any);
    }

    async findAll(adminId: string) {
        const isAdmin = await this.adminService.findByPk(adminId);
        if(!isAdmin) return null;
        return this.customerModel.findAll();
    }
}