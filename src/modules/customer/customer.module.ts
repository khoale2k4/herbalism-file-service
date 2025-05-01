import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from '../../shared/database/models/customer.model';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerRepository } from './customer.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ResponseModule } from '../response/response.module';
import { AuthModule } from 'src/auth/auth.module';
import { AdminModule } from '../admin/admin.module';
import { Address } from 'src/shared/database/models/address.model';

@Module({
    imports: [
        SequelizeModule.forFeature([Customer, Address]), 
        ResponseModule,
        AuthModule,
        AdminModule
    ],
    providers: [CustomerService, CustomerRepository],
    controllers: [CustomerController],
    exports: [CustomerService, CustomerRepository],
})
export class CustomerModule { }
