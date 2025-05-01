import { Controller, Get, Post, Body, UseGuards, Req, Res, HttpStatus, Param } from '@nestjs/common';
import { Response } from '../response/response.entity';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('voucher')
export class VoucherController {
    constructor(
        private readonly voucherService: VoucherService,
        private readonly response: Response

    ) { }
    @Get(':id')
    async getVoucherById(@Param('id') id: string, @Req() req, @Res() res) {
        try {
            const voucher = await this.voucherService.findById(id);

            if (!voucher) {
                this.response.initResponse(false, 'Không tìm thấy voucher', null);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            }

            this.response.initResponse(true, 'Lấy thông tin voucher thành công', voucher);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, 'Đã xảy ra lỗi khi lấy thông tin voucher', null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createVoucher(@Body() dto: CreateVoucherDto, @Req() req, @Res() res) {
        try {
            console.log(req.user);
            if (req.user.role === 'user') {
                this.response.initResponse(false, 'Người dùng không có quyền truy cập tài nguyên này', null);
                return res.status(HttpStatus.FORBIDDEN).json(this.response);
            }
            const voucher = await this.voucherService.create(dto);

            if (!voucher) {
                this.response.initResponse(false, 'Không tìm thấy voucher', null);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            }

            this.response.initResponse(true, 'Tạo voucher thành công', voucher);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, 'Đã xảy ra lỗi khi tạo voucher', null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }
}