import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminController } from './admin.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ResponseModule } from '../response/response.module';
import { AuthModule } from 'src/auth/auth.module';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { Admin } from 'src/shared/database/models/admin.model';

@Module({
    imports: [
        SequelizeModule.forFeature([Admin]), 
        ResponseModule,
        forwardRef(() => AuthModule)
    ],
    providers: [AdminService, AdminRepository],
    controllers: [AdminController],
    exports: [AdminService, AdminRepository],
})
export class AdminModule { }
