import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductController } from './controllers/product.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ResponseModule } from '../response/response.module';
import { AuthModule } from 'src/auth/auth.module';
import { AdminModule } from '../admin/admin.module';
import { Product } from 'src/shared/database/models/product.model';
import { ProductService } from './services/product.service';
import { ProductRepository } from './repositories/product.repository';
import { ProductForms } from 'src/shared/database/models/product-form.model';
import { ProductTypes } from 'src/shared/database/models/product-type.model';
import { ProductTabs } from 'src/shared/database/models/product-tabs.model';
import { WellnessNeeds } from 'src/shared/database/models/wellness-needs.model';
import { SizeStock } from 'src/shared/database/models/size_stock.model';
import { ProductImages } from 'src/shared/database/models/product-image.dto';

@Module({
    imports: [
        SequelizeModule.forFeature([Product, ProductForms, ProductTypes, ProductTabs, WellnessNeeds, SizeStock, ProductImages]), 
        ResponseModule,
        AuthModule,
    ],
    providers: [ProductService, ProductRepository],
    controllers: [ProductController],
    exports: [ProductService, ProductRepository],
})
export class ProductModule { }
