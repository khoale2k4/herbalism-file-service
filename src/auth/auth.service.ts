import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/modules/admin/admin.service';
import { CustomerService } from 'src/modules/customer/customer.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly customerService: CustomerService,
        private readonly adminService: AdminService

    ) { }

    async generateToken(userId: number, email: string) {
        const payload = { sub: userId, email };
        return this.jwtService.sign(payload); // Tạo JWT token
    }

    async login(email: string, password: string) {
        let user = await this.customerService.findByEmail(email);
        if(!user) {
            user = await this.adminService.findByEmail(email);
        }
        console.log(user);
        if(!user) return "No account";
        if(user.password === password) {
            return this.generateToken(user.id, email);
        } else {
            return null;
        }
    }
}