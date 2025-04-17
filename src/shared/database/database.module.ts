import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from './models/customer.model';
import { Product } from './models/product.model';
import { Order } from './models/order.model';
import { Admin } from './models/admin.model';
import { Article } from './models/article.model';
import { CartItem } from './models/cart-item.model';
import { OrderDetail } from './models/order-detail.model';
import { Comment } from './models/comment.model';
import { Address } from './models/address.model';
import { SizeStock } from './models/size_stock.model';
import { ProductForms } from './models/product-form.model';
import { ProductTypes } from './models/product-type.model';
import { WellnessNeeds } from './models/wellness-needs.model';
import { ProductTabs } from './models/product-tabs.model';
import { ProductImages } from './models/product-image.dto';
import { ArticleCategory } from './models/article-category.model';
import { Cart } from './models/cart.model';

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'mariadb',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: 'herbalism_db',
            autoLoadModels: true,
            synchronize: true, // Chỉ dùng cho dev, tắt khi production
            models: [
                Customer,
                Product,
                Order,
                Comment,
                Admin,
                Article,
                CartItem,
                OrderDetail,
                Address,
                SizeStock,
                ProductForms,
                ProductTypes,
                WellnessNeeds,
                ProductTabs,
                ProductImages,
                ArticleCategory,
                Cart
            ],
        }),
    ],
})
export class DatabaseModule { }