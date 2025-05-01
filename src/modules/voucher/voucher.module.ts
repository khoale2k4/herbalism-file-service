import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResponseModule } from '../response/response.module';
import { AuthModule } from 'src/auth/auth.module';
import { AdminModule } from '../admin/admin.module';
import { Address } from 'src/shared/database/models/address.model';
import { Voucher } from 'src/shared/database/models/voucher.model';
import { VoucherService } from './voucher.service';
import { VoucherRepository } from './voucher.repository';
import { VoucherController } from './voucher.controller';

@Module({
    imports: [
        SequelizeModule.forFeature([Voucher]), 
        ResponseModule,
        AuthModule,
        AdminModule
    ],
    providers: [VoucherService, VoucherRepository],
    controllers: [VoucherController],
    exports: [VoucherService, VoucherRepository],
})
export class VoucherModule { }
