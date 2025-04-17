import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { CustomerModule } from 'src/modules/customer/customer.module';
import { CustomerService } from 'src/modules/customer/customer.service';
import { CustomerRepository } from 'src/modules/customer/customer.repository';
import { AuthController } from './auth.controller';
import { ResponseModule } from 'src/modules/response/response.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule } from 'src/modules/admin/admin.module';

@Module({
    imports: [
        PassportModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '24h' },
            }),
        }),
        forwardRef(() => CustomerModule),
        AdminModule,
        ResponseModule
    ],
    providers: [JwtStrategy, AuthService], 
    controllers: [AuthController],
    exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule { }