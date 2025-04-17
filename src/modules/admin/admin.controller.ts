import { Controller, Get, Post, Body, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { Response } from '../response/response.entity';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly response: Response
    ) { }
}