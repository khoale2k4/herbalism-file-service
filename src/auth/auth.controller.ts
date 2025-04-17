import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'src/modules/response/response.entity';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly response: Response
    ) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res) {
        try {
            const login = await this.authService.login(loginDto.mail, loginDto.password);
            if(!login) {
                this.response.initResponse(false, "Tài khoản không tồn tại", null);
                return res.status(HttpStatus.UNAUTHORIZED).json(this.response);
            } else if (login === 'No account') {
                this.response.initResponse(false, "Sai tài khoản hoặc mật khẩu", null);
                return res.status(HttpStatus.UNAUTHORIZED).json(this.response);
            } else {
                this.response.initResponse(true, "Đăng nhập thành công", login);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }
}
