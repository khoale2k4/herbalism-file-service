import { Controller, Get, Post, Body, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from '../response/response.entity';
import { OrderService } from './services/order.service';
import { CreateOrderDto } from './dtos/create-order.dto';

@Controller('order')
export class OrderController {
    constructor(
        private readonly response: Response,
        private readonly orderService: OrderService,

    ) { }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createOrder(@Body() dto: CreateOrderDto, @Req() req, @Res() res) {
        try {
            const order = await this.orderService.createOrder(req.user.id, dto);
            if (!order) {
                this.response.initResponse(false, "Tạo đơn hàng không thành công", order);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Tạo đơn hàng thành công", order);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Post('createFromCart')
    @UseGuards(JwtAuthGuard)
    async createOrderFromCart(@Body() dto: { address: string }, @Req() req, @Res() res) {
        try {
            const order = await this.orderService.createOrderFromCart({ customerId: req.user.id, destination: dto.address });
            if (!order) {
                this.response.initResponse(false, "Tạo đơn hàng không thành công", order);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Tạo đơn hàng thành công", order);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }
}