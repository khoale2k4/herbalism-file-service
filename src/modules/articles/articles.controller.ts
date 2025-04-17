import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from '../response/response.entity';
import { CreateArticleDto } from './dtos/createArticle.dto';
import { ArticleService } from './articles.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('article')
export class ArticleController {
    constructor(
        private readonly configService: ConfigService,
        private readonly response: Response,
        private readonly articleService: ArticleService
    ) { }
    @Post('upload-image')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: 'public/uploads',
            filename: (req, file, callback) => {
                const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}${extname(file.originalname)}`;
                callback(null, uniqueName);
            }
        }),
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    }))
    uploadImage(@UploadedFile() file: Express.Multer.File) {
        const url = `${this.configService.get<string>('MY_HOST') || 'http://localhost:3000'}/uploads/${file.filename}`;
        return { url };
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createNewPost(@Body() dto: CreateArticleDto, @Res() res, @Req() req) {
        try {
            const login = await this.articleService.createArticle(dto, req.user.id);
            this.response.initResponse(true, "Tạo article thành công", login);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Get()
    async getAllArticles(@Res() res) {
        try {
            const article = await this.articleService.getAllArticles();
            if (!article) {
                this.response.initResponse(false, "Tìm articles không thành công", article);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Tìm articles thành công", article);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Get('categories')
    async getAllCategories(@Res() res) {
        try {
            const article = await this.articleService.getAllCategories();
            if (!article) {
                this.response.initResponse(false, "Tìm categories không thành công", article);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Tìm categories thành công", article);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Get(':id')
    async getArticleById(@Param('id') id: string, @Res() res) {
        try {
            const article = await this.articleService.getArticleById(id);
            if (!article) {
                this.response.initResponse(false, "Tìm article không thành công", article);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            } else {
                this.response.initResponse(true, "Tìm article thành công", article);
                return res.status(HttpStatus.OK).json(this.response);
            }
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, "Đã xảy ra lỗi. Vui lòng thử lại", null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }
}
