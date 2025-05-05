import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/modules/admin/admin.service';
import { CustomerService } from 'src/modules/customer/customer.service';
import * as bcrypt from 'bcrypt';
import { CreateCustomerDto } from 'src/modules/customer/dtos/create-customer.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from 'src/shared/database/models/cart.model';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Cart) private readonly cartModel: typeof Cart,
        private readonly jwtService: JwtService,
        private readonly customerService: CustomerService,
        private readonly adminService: AdminService

    ) { }

    async generateToken(userId: number, email: string, role: string) {
        const payload = { sub: userId, email, role };
        return this.jwtService.sign(payload); // Tạo JWT token
    }

    async login(email: string, password: string) {
        let user = await this.customerService.findByEmail(email);
        if (!user) {
            user = await this.adminService.findByEmail(email);
            if (user) {
                user.role = "admin";
            }
        } else {
            user.role = "user";
        }
        console.log(user);
        if (!user) return "No account";
        if (await this.comparePassword(password, user.password)) {
            // if (user.password === password) {
            const { password, ...userWithoutPassword } = user;
            return {
                info: userWithoutPassword,
                token: await this.generateToken(user.id, email, user.role)
            };
        } else {
            return null;
        }
    }

    async register(dto: CreateCustomerDto) {
        let user = await this.customerService.findByEmail(dto.mail);
        if (!user) {
            user = await this.adminService.findByEmail(dto.mail);
        }
        console.log(user);
        if (user) {
            return null;
        } else {
            const customer = await this.customerService.create({
                mail: dto.mail,
                password: dto.password,
                name: dto.name
            });
            // có thể lỗi chỗ này nè
            const cart = await this.cartModel.create({
                customerId: customer.id
            })
            
            const { password, ...dataWithoutPassword } = customer;
            return dataWithoutPassword;
        }
    }

    async comparePassword(
        plainTextPassword: string,
        hashedPassword: string,
    ) {
        console.log('Comparing:', {
            plain: plainTextPassword,
            type: typeof plainTextPassword,
            length: plainTextPassword.length,
            hash: hashedPassword
        });
        const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);

        return isMatch;
    }
}