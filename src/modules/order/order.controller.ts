import { Controller, Get, Post, Body, UseGuards, Req, Res, HttpStatus, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from '../response/response.entity';
import { OrderService } from './services/order.service';
import { FeeService } from './services/fee.service';
import { CreateOrderForGuestDto } from './dtos/create-order-for-guest.dto';

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

    @Get('confirmCancelled/:id')
    @UseGuards(JwtAuthGuard)
    async confirmCancel(@Param('id') id: string, @Req() req, @Res() res) {
        try {
            const order = await this.orderService.cancel(id);
            if (!order) {
                this.response.initResponse(false, "Huỷ đơn không thành công", order);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Huỷ đơn thành công", order);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Get('confirmDelivered/:id')
    @UseGuards(JwtAuthGuard)
    async confirmDeliver(@Param('id') id: string, @Req() req, @Res() res) {
        try {
            if (req.user.role === 'admin') {
                this.response.initResponse(false, 'Người dùng không có quyền truy cập tài nguyên này', null);
                return res.status(HttpStatus.FORBIDDEN).json(this.response);
            }
            const order = await this.orderService.complete(id);
            if (!order) {
                this.response.initResponse(false, "Nhận đơn không thành công", order);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Nhận đơn thành công", order);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Get('confirmShipped/:id')
    @UseGuards(JwtAuthGuard)
    async confirmShipped(@Param('id') id: string, @Req() req, @Res() res) {
        try {
            if (req.user.role === 'user') {
                this.response.initResponse(false, 'Người dùng không có quyền truy cập tài nguyên này', null);
                return res.status(HttpStatus.FORBIDDEN).json(this.response);
            }
            const order = await this.orderService.ship(id);
            if (!order) {
                this.response.initResponse(false, "Vận chuyển đơn hàng không thành công", order);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Vận chuyển đơn hàng thành công", order);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Post('create')
    async createOrder(@Body() dto: CreateOrderForGuestDto, @Req() req, @Res() res) {
        try {
            const order = await this.orderService.createOrderForGuest(dto);
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
    async createOrderFromCart(@Body() dto: { addressId: string, voucherId?: string, paymentMethod: 'cod' | 'bank' }, @Req() req, @Res() res) {
        try {
            const order = await this.orderService.createOrderFromCart(
                {
                    customerId: req.user.id,
                    addressId: dto.addressId,
                    voucherId: dto.voucherId,
                    paymentMethod: dto.paymentMethod?? 'cod'
                });
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

    @Get(':id')
    // @UseGuards(JwtAuthGuard)
    async getById(@Param('id') id: string, @Res() res, @Req() req) {
        try {
            const order = await this.orderService.getById(id);
            if (!order) {
                this.response.initResponse(false, "Lấy đơn hàng không thành công", order);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Lấy đơn hàng thành công", order);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }
}