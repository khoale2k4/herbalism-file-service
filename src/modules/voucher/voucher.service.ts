import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { Voucher } from 'src/shared/database/models/voucher.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateVoucherDto } from './dtos/create-voucher.dto';

@Injectable()
export class VoucherService {
    constructor(
        @InjectModel(Voucher) private readonly voucherModel: typeof Voucher, 
    ) { }

    async create(dto: CreateVoucherDto) {
        return await this.voucherModel.create({
            ...dto
        })
    }

    async findById(id: string) {
        return await this.voucherModel.findByPk(id);
    }
}