import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from '../../shared/database/models/customer.model';
import { ResponseModule } from '../response/response.module';
import { AuthModule } from 'src/auth/auth.module';
import { CartService,  } from './cart.service';
import { CartRepository,  } from './repositories/cart.repository';
import { CartController } from './cart.controller';
import { CartItem } from 'src/shared/database/models/cart-item.model';
import { CartItemRepository } from './repositories/cart-item.repository';
import { Cart } from 'src/shared/database/models/cart.model';
import { Product } from 'src/shared/database/models/product.model';
import { ProductModule } from '../product/product.module';

@Module({
    imports: [
        SequelizeModule.forFeature([Customer, CartItem, Cart, Product]),
        ResponseModule,
        forwardRef(() => AuthModule), 
        ProductModule,
    ],
    providers: [CartService, CartRepository, CartItemRepository],
    controllers: [CartController],
    exports: [CartService, CartRepository, CartItemRepository],
})
export class CartModule { }
