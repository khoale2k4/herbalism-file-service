import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { Request, Response } from 'express';
const qs = require('qs');
import dateFormat from 'dateformat';
import { createHmac } from 'crypto';

@Injectable()
export class VnpayService {
    constructor(
        private sequelize: Sequelize,
    ) { }

    async createPaymentUrl(req: Request, res: Response) {
        const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '103.156.4.86';

        var tmnCode = 'KWFHOEU7';
        var secretKey = 'XHIPJQXUYDB75A2AKQ0C85VU515OL8C1';
        var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        var returnUrl = 'http://localhost:4001';

        var date = new Date();

        var createDate = this.formatDate(date, 'yyyymmddHHmmss');
        var orderId = this.formatDate(date, 'HHmmss');
        var amount = req.body.amount;
        var bankCode = req.body.bankCode;

        var orderInfo = req.body.orderDescription;
        var orderType = req.body.orderType;
        var locale = req.body.language;
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = this.sortObject(vnp_Params);

        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        console.log(vnpUrl);
        return { url: vnpUrl };
    }

    private formatDate(date: Date, format: string): string {
      return format
        .replace('YYYY', date.getFullYear().toString())
        .replace('MM', ('0' + (date.getMonth() + 1)).slice(-2))
        .replace('DD', ('0' + date.getDate()).slice(-2))
        .replace('HH', ('0' + date.getHours()).slice(-2))
        .replace('mm', ('0' + date.getMinutes()).slice(-2))
        .replace('ss', ('0' + date.getSeconds()).slice(-2));
    }

    private sortObject(obj: any): any {
        const sorted = {};
        const keys = Object.keys(obj).sort();
        for (const key of keys) {
            sorted[key] = obj[key];
        }
        return sorted;
    }
}