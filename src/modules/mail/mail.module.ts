import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResponseModule } from '../response/response.module';
import { AuthModule } from 'src/auth/auth.module';
import { Mail } from 'src/shared/database/models/mail.model';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        SequelizeModule.forFeature([Mail]),
        ResponseModule,
        ConfigModule,
        AuthModule,
    ],
    providers: [MailService, MailController],
    controllers: [MailController],
    exports: [MailController, MailService],
})
export class MailModule { }
