
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UUID } from 'crypto';
import { Admin } from 'src/shared/database/models/admin.model';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Admin)
        private adminModel: typeof Admin,
    ) { }
    async findByPk(id: string) {
        return await this.adminModel.findByPk(id);
    }
    
    async findByEmail(email: string) {
        const result = await this.adminModel.findOne({
            where: {mail: email}
        })
        return result?.dataValues;
    }
}