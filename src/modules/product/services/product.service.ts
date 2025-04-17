
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UUID } from 'crypto';
import { Sequelize } from 'sequelize-typescript';
import { Product } from 'src/shared/database/models/product.model';
import { SizeStock } from 'src/shared/database/models/size_stock.model';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductTypes } from 'src/shared/database/models/product-type.model';
import { ProductForms } from 'src/shared/database/models/product-form.model';
import { WellnessNeeds } from 'src/shared/database/models/wellness-needs.model';
import { AddStockDto } from '../dtos/add-stock.dto';
import { CreateSizeStockDto } from '../dtos/create-sizestock.dto';
import { Includeable, ModelStatic } from 'sequelize';
import { ProductTabs } from 'src/shared/database/models/product-tabs.model';
import { ProductImages } from 'src/shared/database/models/product-image.dto';
import { Customer } from 'src/shared/database/models/customer.model';
import { Comment } from 'src/shared/database/models/comment.model';

@Injectable()
export class ProductService {
    constructor(
        private sequelize: Sequelize,
        @InjectModel(Product) private productModel: typeof Product,
        @InjectModel(ProductForms) private formModel: typeof ProductForms,
        @InjectModel(ProductTypes) private typeModel: typeof ProductTypes,
        @InjectModel(WellnessNeeds) private needModel: typeof WellnessNeeds,
        @InjectModel(SizeStock) private sizeStockModel: typeof SizeStock,
        @InjectModel(ProductTabs) private tabModel: typeof ProductTabs,
        @InjectModel(ProductImages) private imageModel: typeof ProductImages
    ) { }
    async createProduct(data: CreateProductDto) {
        const price = Math.min(...data.size_stock.map(si_st => si_st.price));

        let type = await this.findProductType(data.product_type);
        if (!type) {
            type = await this.createProductType(data.product_type);
        }
        let form = await this.findProductForm(data.product_form);
        if (!form) {
            form = await this.createProductForm(data.product_form);
        }

        let need = await this.findWellnessNeed(data.wellness_need);
        if (!need) {
            need = await this.createWellnessNeed(data.wellness_need);
        }

        const product = await this.productModel.create({
            name: data.name,
            price: price,
            content: data.content,
            typeId: type.id,
            formId: form.id,
            needId: need.id
        });

        data.tabs.map(async (tab) => {
            await this.tabModel.create({
                productId: product.id,
                name: tab.name,
                description: tab.description
            });
        })

        data.images.map(async (image) => {
            await this.imageModel.create({
                productId: product.id,
                url: image
            });
        })

        data.size_stock.map(async (sizeStock) => {
            await this.sizeStockModel.create({
                productId: product.id,
                size: sizeStock.size,
                stock: sizeStock.stock,
                price: sizeStock.price
            });
        })

        return product;
    }

    async findProductById(id: string) {
        const product = await this.productModel.findByPk(
            id,
            {
                attributes: ['id', 'name', 'price', 'rate', 'content', 'createdAt'],
                include: [
                    {
                        model: ProductImages,
                        as: 'images',
                        attributes: ['url'],
                        required: false
                    },
                    {
                        model: ProductTypes,
                        as: 'type',
                        attributes: ['name'],
                        required: false
                    }, {
                        model: ProductForms,
                        as: 'form',
                        attributes: ['name'],
                        required: false
                    }, {
                        model: WellnessNeeds,
                        as: 'need',
                        attributes: ['name'],
                        required: false
                    },
                    {
                        model: ProductTabs,
                        attributes: ['name', 'description'],
                        as: 'tabs',
                        required: false
                    },
                    {
                        model: SizeStock,
                        attributes: ['size', 'stock', 'price'],
                        as: 'size_stock',
                        required: false
                    },
                    {
                        model: Comment,
                        attributes: ['id', 'content', 'rate', 'createdAt'],
                        as: 'comments',
                        required: false,
                        include: [
                            {
                                model: Customer,
                                attributes: ['id', 'name'],
                                as: 'customer',
                                required: false,
                            }
                        ]
                    }
                ]
            }
        );
        return product;
    }

    async addToStock(dto: AddStockDto) {
        const product = await this.findProductById(dto.productId);
        if (!product) return null;

        const sizeStock = await this.getSizeStockOfProduct(dto.productId, dto.size) as SizeStock;
        if (sizeStock) {
            sizeStock.stock += dto.stock;
            await sizeStock.save();
            return sizeStock;
        } else {
            const newSizeStock = await this.sizeStockModel.create({
                productId: dto.productId,
                size: dto.size,
                stock: dto.stock,
            });
            return newSizeStock;
        }
    }

    async findAllProducts() {
        const products = await Product.findAll({
            attributes: ['id', 'name', 'rate'],
            include: [
                {
                    model: ProductTypes,
                    as: 'type',
                    attributes: ['name'],
                    required: false
                }, {
                    model: ProductForms,
                    as: 'form',
                    attributes: ['name'],
                    required: false
                }, {
                    model: WellnessNeeds,
                    as: 'need',
                    attributes: ['name'],
                    required: false
                }, {
                    model: SizeStock,
                    as: 'size_stock',
                    attributes: ['size', 'price', 'stock'],
                    required: false
                }, {
                    model: ProductImages,
                    as: 'images',
                    attributes: ['url'],
                    order: [['createdAt', 'ASC']],
                    required: false,
                }
            ],
        }
        );

        return products.map((product) => {
            const plainProduct = product.get({ plain: true });

            const prices = plainProduct.size_stock?.map((s) => s.price) || [];
            const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
            const totalStock = (plainProduct.size_stock || []).reduce((acc, s) => acc + Number(s.stock), 0);

            return {
                id: plainProduct.id,
                name: plainProduct.name,
                rate: plainProduct.rate,
                type: plainProduct.type,
                form: plainProduct.form,
                need: plainProduct.need,
                size_stock: plainProduct.size_stock,
                totalStock: totalStock,
                price: minPrice,
                images: plainProduct.images
            };
        });
    }

    // need to modify more
    async searchProducts(filters: {
        name?: string;
        form?: string;
        type?: string;
        need?: string;
    }): Promise<Product[]> {
        const includeOptions: Includeable[] = [
            {
                model: SizeStock,
                attributes: ['size', 'stock'],
            }
        ];

        if (filters.form) {
            includeOptions.push({
                model: this.formModel as unknown as ModelStatic<ProductForms>,
                where: { name: filters.form },
                attributes: [],
                required: true
            });
        }

        if (filters.type) {
            includeOptions.push({
                model: this.typeModel as unknown as ModelStatic<ProductTypes>,
                where: { name: filters.type },
                attributes: [],
                required: true
            });
        }

        if (filters.need) {
            includeOptions.push({
                model: this.needModel as unknown as ModelStatic<WellnessNeeds>,
                where: { name: filters.need },
                attributes: [],
                required: true
            });
        }

        return this.productModel.findAll({
            include: includeOptions,
        });
    }

    async findProductType(name: string) {
        return await this.typeModel.findOne({
            where: { name }
        });
    }

    async findProductForm(name: string) {
        return await this.formModel.findOne({
            where: { name }
        });
    }

    async findWellnessNeed(name: string) {
        return await this.needModel.findOne({
            where: { name }
        });
    }

    async createProductType(name: string) {
        return await this.typeModel.create({
            name
        });
    }

    async createProductForm(form: string) {
        return await this.formModel.create({
            name: form
        });
    }

    async createWellnessNeed(need: string) {
        return await this.needModel.create({
            name: need
        });
    }

    async createSizeStock(dto: CreateSizeStockDto) {
        return await this.sizeStockModel.create({
            dto
        });
    }

    async getSizeStockOfProduct(productId: string, size?: string) {
        const sizeStocks = await this.sizeStockModel.findAll({
            where: { productId }
        });

        const plainSizeStocks = sizeStocks.map(stock =>
            stock.get?.({ plain: true }) || stock
        );

        if (!size) return plainSizeStocks;

        const normalizedTargetSize = size.trim().toLowerCase();
        const foundSize = plainSizeStocks.find(s =>
            s.size.trim().toLowerCase() === normalizedTargetSize
        );

        if (!foundSize) {
            const availableSizes = plainSizeStocks.map(s => s.size);
            throw new Error(
                `Product Size ${productId}, ${size} not found. ` +
                `Available sizes: ${availableSizes.join(', ')}`
            );
        }

        return foundSize;
    }

    async getProductTypes() {
        return await this.typeModel.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']]
        });
    }

    async getProductForms() {
        return await this.formModel.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']]
        });
    }

    async getWellnessNeeds() {
        return await this.needModel.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']]
        });
    }
}