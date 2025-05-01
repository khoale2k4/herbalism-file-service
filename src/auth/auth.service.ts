import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/modules/admin/admin.service';
import { CustomerService } from 'src/modules/customer/customer.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
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
        // if (await this.comparePassword(user.password, password)) {
        if (user.password === password) {
            const { password, ...userWithoutPassword } = user;
            return {
                info: userWithoutPassword,
                token: await this.generateToken(user.id, email, user.role)
            };
        } else {
            return null;
        }
    }

    async comparePassword(
        plainTextPassword: string,
        hashedPassword: string,
    ) {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
    }
}