import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Mail } from "src/shared/database/models/mail.model";
import * as nodemailer from 'nodemailer';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    constructor(
        @InjectModel(Mail) private readonly mailModel: typeof Mail,
        private readonly configService: ConfigService,
    ) {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASS'),
            },
        });
    }

    async sendMail(to: string, subject: string, html: string) {
        const info = await this.transporter.sendMail({
            from: `"Herbalism" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log('Message sent: %s', info.messageId);
        return info;
    }

    async sendMails(to: string[], subject: string, html: string): Promise<void> {
        to.map(async (mail: string) => {
            const info = await this.transporter.sendMail({
                from: `"Herbalism" <${process.env.MAIL_USER}>`,
                to: mail,
                subject,
                html,
            });
        })
    }

    async getMails() {
        return this.mailModel.findAll();
    }

    async addMail(mail: string) {
        const existedMail = await this.mailModel.findOne({
            where: {
                id: mail
            }
        })
        await this.sendMail(
            mail,
            'Subscription Confirmation',
            '<h1>Thanks for subscribing!</h1><p>We’ll keep you updated with our latest news.</p>',
        );
        if (!existedMail) {
            return await this.mailModel.create({
                id: mail
            });
        }
        return existedMail;
    }
}