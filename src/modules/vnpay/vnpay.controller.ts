import { Controller, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from 'express';
import { VnpayService } from "./vnpay.service";

@Controller('vnpay')
export class VnpayController {
    constructor(
        // private readonly response: Response,
        private readonly vnpayService: VnpayService
    ) { }
  
    @Post('create-payment-url')
    async createPaymentUrl(@Req() req: Request, @Res() res: Response) {
        return await this.vnpayService.createPaymentUrl(req, res);
    }
}