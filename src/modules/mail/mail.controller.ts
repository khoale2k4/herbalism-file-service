import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "../response/response.entity";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { MailService } from "./mail.service";
import { SendMailsDto } from "./dtos/send-mails.dto";

@Controller('mail')
export class MailController {
    constructor(
        private readonly response: Response,
        private readonly mailService: MailService,
    ) { }

    @Post('create')
    async createMail(@Body() body: { mail: string }, @Req() req, @Res() res) {
        try {
            const mail = await this.mailService.addMail(body.mail);
            if (!mail) {
                this.response.initResponse(false, "Thêm mail không thành công", mail);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Thêm mail thành công", mail);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.error(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Get('')
    @UseGuards(JwtAuthGuard)
    async getAll(@Body() body: { mail: string }, @Req() req, @Res() res) {
        try {
            if (req.user.role === 'user') {
                this.response.initResponse(false, 'Người dùng không có quyền truy cập tài nguyên này', null);
                return res.status(HttpStatus.FORBIDDEN).json(this.response);
            }
            const mails = await this.mailService.getMails();
            if (!mails) {
                this.response.initResponse(false, "Lấy mail không thành công", mails);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Lấy mail thành công", mails);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.error(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Post('sendmailtest')
    async Sendmai(@Body() body: { mail: string }, @Req() req, @Res() res) {
        try {
            await this.mailService.sendMail(
                body.mail,
                'Subscription Confirmation',
                '<h1>Thanks for subscribing!</h1><p>We’ll keep you updated with our latest news.</p>',
            );
            this.response.initResponse(false, "Gửi mail thành công", null);
            return res.status(HttpStatus.NOT_FOUND).json(this.response);
        } catch (error) {
            console.error(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Post('send')
    @UseGuards(JwtAuthGuard)
    async sendmail(@Body() body: SendMailsDto, @Req() req, @Res() res) {
        try {
            if (req.user.role === 'user') {
                this.response.initResponse(false, 'Người dùng không có quyền truy cập tài nguyên này', null);
                return res.status(HttpStatus.FORBIDDEN).json(this.response);
            }
            await this.mailService.sendMails(
                body.mails,
                body.subject,
                body.html,
            );
            this.response.initResponse(false, "Gửi mails thành công", null);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.error(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }
}