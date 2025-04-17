
import { Injectable } from '@nestjs/common';
import { Customer } from '../../shared/database/models/customer.model';
import { InjectModel } from '@nestjs/sequelize';
import { UUID } from 'crypto';
import { AdminService } from '../admin/admin.service';
import { CartItem } from 'src/shared/database/models/cart-item.model';
import { Cart } from 'src/shared/database/models/cart.model';
import { Product } from 'src/shared/database/models/product.model';
import { SizeStock } from 'src/shared/database/models/size_stock.model';
import { ProductService } from '../product/services/product.service';
import { ProductImages } from 'src/shared/database/models/product-image.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(CartItem) private readonly cartItemModel: typeof CartItem,
        @InjectModel(Cart) private readonly cartModel: typeof Cart,
        @InjectModel(Customer) private readonly customerModel: typeof Customer,
        @InjectModel(Product) private readonly productModel: typeof Product,
        private readonly productService: ProductService
    ) {
    }

    async getCartOfCustomer(userId: string) {
        const cart = await this.cartModel.findOne({
            where: {
                customerId: userId,
            },
        });
        return cart;
    }

    async getItemsInCart(userId: string) {
        const cart = await this.getCartOfCustomer(userId);
        if (!cart) return [];

        const items = await this.cartItemModel.findAll({
            where: {
                cartId: cart.id,
            },
            attributes: ['id', 'num', 'size'],
            include: [
                {
                    model: Product,
                    attributes: ['id', 'name', 'price'],
                    as: 'product',
                    required: false,
                    include: [
                        {
                            model: ProductImages,
                            attributes: ['url'],
                            as: 'images',
                        }
                    ]
                },
            ],
        });

        return items;
    }

    async addToCart(userId: string, productId: string, size: string, num: number) {
        const cart = await this.getCartOfCustomer(userId);
        if (!cart) return null;
        const product = (await this.productService.findProductById(productId))?.dataValues;
        if (!product) {
            throw new Error('Product not found');
        }
        const stock = product.size_stock.find((item: SizeStock) => item?.dataValues.size === size);
        if (!stock) {
            throw new Error('Size not found');
        }
        if (stock.stock < num) {
            throw new Error('Not enough stock');
        }
        const existingCartItem = await this.cartItemModel.findOne({
            where: {
                cartId: cart.id,
                productId,
                size,
            },
        });

        if (existingCartItem) {
            const newNum = existingCartItem?.get('num') + num;
            if(newNum <= 0) {
                await this.cartItemModel.destroy({
                    where: {
                        id: existingCartItem.id,
                    },
                });
                return existingCartItem;
            } else {
                const item = await this.cartItemModel.update(
                    { num: newNum },
                    { where: { id: existingCartItem.id } }
                );
                return item;
            }
        } else {
            if(num <= 0) {
                return null;
            }
            const cartItem = await this.cartItemModel.create({
                cartId: cart.id,
                productId: productId,
                size: size,
                num: num
            });

            return cartItem;
        }
    }

    async clearCart(userId: string) {
        const cart = await this.getCartOfCustomer(userId);
        if (!cart) return null;
        const items = await this.cartItemModel.destroy({
            where: {
                cartId: cart.id,
            },
        });
        return items;
    }
}