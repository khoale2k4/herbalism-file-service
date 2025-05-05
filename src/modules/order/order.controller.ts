import { Controller, Get, Post, Body, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from '../response/response.entity';
import { OrderService } from './services/order.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { FeeService } from './services/fee.service';

@Controller('order')
export class OrderController {
    constructor(
        private readonly response: Response,
        private readonly orderService: OrderService,
        private readonly feeService: FeeService

    ) { }

    @Get('getmy')
    @UseGuards(JwtAuthGuard)
    async getMy(@Req() req, @Res() res) {
        try {
            const orders = await this.orderService.getMyOrders(req.user.id);
            if (!orders) {
                this.response.initResponse(false, "Không có đơn hàng nào", orders);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Lấy danh sách đơn hàng thành công", orders);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Get('getAll')
    @UseGuards(JwtAuthGuard)
    async getAll(@Req() req, @Res() res) {
        try {
            const orders = await this.orderService.getAll();
            if (!orders) {
                this.response.initResponse(false, "Không có đơn hàng nào", orders);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Lấy danh sách đơn hàng thành công", orders);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

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
    async createOrderFromCart(@Body() dto: { addressId: string }, @Req() req, @Res() res) {
        try {
            const order = await this.orderService.createOrderFromCart({ customerId: req.user.id, addressId: dto.addressId });
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

    @Get('fee')
    async getFee(@Res() res) {
        try {
            const order = await this.feeService.calculateFee(0);
            if (!order) {
                this.response.initResponse(false, "Tính phí không thành công", order);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Tính phí thành công", order);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Get('unpaid')
    @UseGuards(JwtAuthGuard)
    async getUnPaidOrders(@Res() res, @Req() req) {
        try {
            const order = await this.orderService.getPendingOrders(req.user.id);
            if (!order) {
                this.response.initResponse(false, "Lấy các đơn hàng chưa thanh toán không thành công", order);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Lấy các đơn hàng chưa thanh toán thành công", order);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

}