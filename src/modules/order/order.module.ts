import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from '../../shared/database/models/customer.model';
import { ResponseModule } from '../response/response.module';
import { AuthModule } from 'src/auth/auth.module';
import { CartItem } from 'src/shared/database/models/cart-item.model';
import {  OrderService,  } from './services/order.service';
import {  OrderRepository,  } from './order.repository';
import { Order } from 'src/shared/database/models/order.model';
import { OrderController } from './order.controller';
import { ProductModule } from '../product/product.module';
import { ProductRepository } from '../product/repositories/product.repository';
import { CartModule } from '../cart/cart.module';
import { Product } from 'src/shared/database/models/product.model';
import { OrderDetail } from 'src/shared/database/models/order-detail.model';
import { FeeService } from './services/fee.service';
import { SizeStock } from 'src/shared/database/models/size_stock.model';
import { VoucherService } from '../voucher/voucher.service';
import { VoucherModule } from '../voucher/voucher.module';

@Module({
    imports: [
        SequelizeModule.forFeature([Order, CartItem, Product, OrderDetail, SizeStock]), 
        ResponseModule,
        AuthModule,
        ProductModule,
        CartModule,
        VoucherModule
    ],
    providers: [OrderService, OrderRepository, FeeService],
    controllers: [OrderController],
    exports: [OrderService, OrderRepository, FeeService],
})
export class OrderModule { }
