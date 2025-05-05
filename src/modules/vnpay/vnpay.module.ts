import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResponseModule } from '../response/response.module';
import { VnpayService } from './vnpay.service';
import { VnpayController } from './vnpay.controller';


@Module({
    imports: [
        SequelizeModule.forFeature([]), 
        ResponseModule,
    ],
    providers: [VnpayService],
    controllers: [VnpayController],
    exports: [VnpayService],
})
export class VnpayModule { }
