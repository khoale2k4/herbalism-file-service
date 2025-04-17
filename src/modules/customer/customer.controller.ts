import { Controller, Get, Post, Body, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from '../response/response.entity';

@Controller('customer')
export class CustomerController {
    constructor(
        private readonly customerService: CustomerService,
        private readonly response: Response

    ) { }

    @Post()
    create(@Body() createCustomerDto: CreateCustomerDto) {
        return this.customerService.create(createCustomerDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getMe(@Req() req, @Res() res) {
        try {
            console.log(req.user);
            const customer = await this.customerService.findById(req.user.id);
            this.response.initResponse(true, 'Lấy thông tin thành công', customer);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, 'Đã xảy ra lỗi. Vui lòng thử lại', null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)
    async findAll(@Req() req, @Res() res) {
        try {
            console.log(req.user);
            const customer = await this.customerService.findAll(req.user.id);
            if(!customer) {
                this.response.initResponse(false, 'Người dùng không có quyền truy cập', customer);
                return res.status(HttpStatus.FORBIDDEN).json(this.response);
            } else {
                this.response.initResponse(true, 'Lấy thông tin thành công', customer);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, 'Đã xảy ra lỗi. Vui lòng thử lại', null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }
}