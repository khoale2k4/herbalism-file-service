import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "../response/response.entity";
import { CommentService } from "./comment.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateCommentDto } from "./dtos/create-comment.dto";

@Controller('comment')
export class CommentController {
    constructor(
        private readonly response: Response,
        private readonly commentService: CommentService,
    ) { }

    @Get('isCommented/:productId')
    @UseGuards(JwtAuthGuard)
    async isCommented(@Param('productId') productId: string, @Req() req, @Res() res) {
        try {
            const isCommented = await this.commentService.isCommented(req.user.id, productId);
            if (!isCommented) {
                this.response.initResponse(false, "Bạn chưa bình luận sản phẩm này", isCommented);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Bạn đã bình luận sản phẩm này", isCommented);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.error(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createComment(@Body() dto: CreateCommentDto, @Req() req, @Res() res) {
        try {
            const comment = await this.commentService.createComment(req.user.id, dto);
            if (!comment) {
                this.response.initResponse(false, "Tạo bình luận không thành công", comment);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Tạo bình luận thành công", comment);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.error(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }
}