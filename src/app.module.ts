import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerController } from './modules/customer/customer.controller';
import { CustomerService } from './modules/customer/customer.service';
import { CustomerRepository } from './modules/customer/customer.repository';
import { CustomerModule } from './modules/customer/customer.module';
import { DatabaseModule } from './shared/database/database.module';
import { ResponseModule } from './modules/response/response.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ArticleModule } from './modules/articles/articles.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { CartModule } from './modules/cart/cart.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Đường dẫn tuyệt đối tới thư mục public
      serveRoot: '/',                            // Gốc URL để truy cập file
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }), CustomerModule, DatabaseModule, ResponseModule, AuthModule, ArticleModule, ProductModule, CartModule, OrderModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(configService: ConfigService) {
    console.log('JWT_SECRET:', configService.get('JWT_SECRET'));
  }
}
