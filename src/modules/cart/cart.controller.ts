import { Controller, Get, Post, Body, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from '../response/response.entity';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
    constructor(
        private readonly response: Response,
        private readonly cartService: CartService

    ) { }

    @Get('')
    @UseGuards(JwtAuthGuard)
    async getCartItems(@Req() req, @Res() res) {
        try {
            const items = await this.cartService.getItemsInCart(req.user.id);
            if (!items) {
                this.response.initResponse(false, "Tìm items không thành công", items);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Tìm items thành công", items);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Post('add')
    @UseGuards(JwtAuthGuard)
    async addToCart(@Body() dto: { productId: string, size: string, num: number }, @Req() req, @Res() res) {
        try {
            const item = await this.cartService.addToCart(req.user.id, dto.productId, dto.size, dto.num);
            if (!item) {
                this.response.initResponse(false, "Thêm item không thành công", item);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Thêm item thành công", item);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại. " + error, null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

}