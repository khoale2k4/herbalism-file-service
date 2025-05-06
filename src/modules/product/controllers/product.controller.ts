import { Controller, Get, Post, Body, UseGuards, Req, Res, HttpStatus, Param, Query, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from '../../response/response.entity';
import { AddStockDto } from '../dtos/add-stock.dto';
import { CreateProductDto } from '../dtos/create-product.dto';
import { SearchProductsDto } from '../dtos/search-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ConfigService } from '@nestjs/config';

@Controller('product')
export class ProductController {
    constructor(
        private readonly configService: ConfigService,
        private readonly productService: ProductService,
        private readonly response: Response
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

    @Get()
    async getAllProducts(@Req() req, @Res() res) {
        try {
            const products = await this.productService.findAllProducts();
            this.response.initResponse(true, 'Lấy danh sách sản phẩm thành công', products);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, 'Đã xảy ra lỗi khi lấy danh sách sản phẩm', null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Get('suggest')
    async getSuggestProducts(@Res() res) {
        try {
            const products = await this.productService.getSuggestedProducts();
            this.response.initResponse(true, 'Lấy danh sách sản phẩm gợi ý thành công', products);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, 'Đã xảy ra lỗi khi lấy danh sách sản phẩm gợi ý', null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createProduct(
        @Body() createProductDto: CreateProductDto,
        @Req() req,
        @Res() res
    ) {
        try {
            const product = await this.productService.createProduct(createProductDto);
            this.response.initResponse(true, 'Tạo sản phẩm thành công', product);
            return res.status(HttpStatus.CREATED).json(this.response);
        } catch (error) {
            console.error(error);
            this.response.initResponse(false, 'Tạo sản phẩm thất bại', null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Get('search')
    async searchProducts(
        @Query() searchDto: SearchProductsDto,
        @Req() req,
        @Res() res
    ) {
        try {
            const products = await this.productService.searchProducts({
                form: searchDto.form,
                type: searchDto.type,
                need: searchDto.need
            });

            this.response.initResponse(true, 'Tìm kiếm sản phẩm thành công', products);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.error(error);
            this.response.initResponse(false, 'Tìm kiếm sản phẩm thất bại', null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Get('forms/all')
    async getAllForms(@Req() req, @Res() res) {
        try {
            const forms = await this.productService.getProductForms();
            this.response.initResponse(true, 'Lấy danh sách forms thành công', forms);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.error(error);
            this.response.initResponse(false, 'Lấy danh sách forms thất bại', null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Get('types/all')
    async getAllTypes(@Req() req, @Res() res) {
        try {
            const types = await this.productService.getProductTypes();
            this.response.initResponse(true, 'Lấy danh sách types thành công', types);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.error(error);
            this.response.initResponse(false, 'Lấy danh sách types thất bại', null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Get('needs/all')
    async getAllNeeds(@Req() req, @Res() res) {
        try {
            const needs = await this.productService.getWellnessNeeds();
            this.response.initResponse(true, 'Lấy danh sách needs thành công', needs);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.error(error);
            this.response.initResponse(false, 'Lấy danh sách needs thất bại', null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Get('categories/all')
    async getAllCategories(@Req() req, @Res() res) {
        try {
            const [forms, types, needs] = await Promise.all([
                this.productService.getProductForms(),
                this.productService.getProductTypes(),
                this.productService.getWellnessNeeds()
            ]);

            this.response.initResponse(true, 'Lấy danh sách categories thành công', {
                forms,
                types,
                needs
            });
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.error(error);
            this.response.initResponse(false, 'Lấy danh sách categories thất bại', null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Get(':id')
    async getProductById(@Param('id') id: string, @Req() req, @Res() res) {
        try {
            const product = await this.productService.findProductById(id);

            if (!product) {
                this.response.initResponse(false, 'Không tìm thấy sản phẩm', null);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            }

            this.response.initResponse(true, 'Lấy thông tin sản phẩm thành công', product);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, 'Đã xảy ra lỗi khi lấy thông tin sản phẩm', null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: CreateProductDto, @Req() req, @Res() res) {
        try {
            const product = await this.productService.updateProducts(id, dto);

            if (!product) {
                this.response.initResponse(false, 'Cập nhật sản phẩm thất bại', null);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            }

            this.response.initResponse(true, 'Cập nhật sản phẩm thành công', product);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, 'Đã xảy ra lỗi khi lấy thông tin sản phẩm', null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }

    @Post('add-stock')
    @UseGuards(JwtAuthGuard)
    async addToStock(@Body() addStockDto: AddStockDto, @Req() req, @Res() res) {
        try {
            const result = await this.productService.addToStock(addStockDto);

            if (!result) {
                this.response.initResponse(false, 'Không tìm thấy sản phẩm', null);
                return res.status(HttpStatus.NOT_FOUND).json(this.response);
            }

            this.response.initResponse(true, 'Thêm hàng vào kho thành công', result);
            return res.status(HttpStatus.OK).json(this.response);
        } catch (error) {
            console.log(error);
            this.response.initResponse(false, 'Đã xảy ra lỗi khi thêm hàng vào kho', null);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
        }
    }
}