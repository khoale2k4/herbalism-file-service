
import { Inject, Injectable } from '@nestjs/common';
import { Customer } from '../../../shared/database/models/customer.model';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { UUID } from 'crypto';
import { AdminService } from '../../admin/admin.service';
import { CartItem } from 'src/shared/database/models/cart-item.model';
import { Order } from 'src/shared/database/models/order.model';
import { CreateOrderForGuestDto, OrderItemDto } from '../dtos/create-order-for-guest.dto';
import { Product } from 'src/shared/database/models/product.model';
import { SizeStock } from 'src/shared/database/models/size_stock.model';
import { Cart } from 'src/shared/database/models/cart.model';
import { CartService } from '../../cart/cart.service';
import { OrderDetail } from 'src/shared/database/models/order-detail.model';
import { FeeService } from './fee.service';
import { CreateOrderFromCartDto } from '../dtos/create-order-from-cart.dto';
import { ProductService } from 'src/modules/product/services/product.service';
import { Sequelize } from 'sequelize-typescript';
import { ProductImages } from 'src/shared/database/models/product-image.dto';
import { Address } from 'src/shared/database/models/address.model';
import { VoucherService } from 'src/modules/voucher/voucher.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order) private readonly orderModel: typeof Order,
        @InjectModel(Product) private readonly productModel: typeof Product,
        @InjectModel(CartItem) private readonly cartItemModel: typeof CartItem,
        @InjectModel(Address) private addressModel: typeof Address,
        @InjectModel(OrderDetail) private readonly orderDetailModel: typeof OrderDetail,
        @InjectModel(SizeStock) private readonly sizeStockModel: typeof SizeStock,
        @InjectConnection() private readonly sequelize: Sequelize,
        private readonly cartService: CartService,
        private readonly feeService: FeeService,
        private readonly productService: ProductService,
        private readonly voucherService: VoucherService
    ) {
    }

    async cancel(id: string) {
        const order = await this.getById(id);

        if (!order) {
            throw Error("Order not found");
        }

        await this.orderModel.update({
            ...order,
            status: 'cancelled'
        }, {
            where: {
                id
            }
        })
        return order;
    }

    async complete(id: string) {
        const order = await this.getById(id);

        if (!order) {
            throw Error("Order not found");
        }

        await this.orderModel.update({
            ...order,
            status: 'delivered'
        }, {
            where: {
                id
            }
        })
        return order;
    }

    async ship(id: string) {
        const order = await this.getById(id);

        if (!order) {
            throw Error("Order not found");
        }

        await this.orderModel.update({
            ...order,
            status: 'shipped'
        }, {
            where: {
                id
            }
        })
        return order;
    }

    async getMyOrders(userId: string) {
        return await this.orderModel.findAll({
            where: {
                customerId: userId
            },
            include: [
                {
                    model: Customer,
                    attributes: ['id', 'name', 'mail'],
                },
                {
                    model: OrderDetail,
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'name', 'price'],
                        },
                    ],
                },
                {
                    model: Address,
                }
            ],
        });
    }

    async getAll() {
        return await this.orderModel.findAll({
            include: [
                {
                    model: Customer,
                    attributes: ['id', 'name', 'mail'],
                },
                {
                    model: OrderDetail,
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'name', 'price'],
                        },
                    ],
                },
            ],
        });
    }

    // need to add trackingNumber
    async createOrderForGuest(dto: CreateOrderForGuestDto) {
        return await this.sequelize.transaction(async (t) => {
            const address = await this.addressModel.create({
                ...dto.address,
                customerId: 'guest-id'
            });
            const { itemPrices, products } = await this.validateItemsAndCalculateTotal(dto.items, t);

            const subtotal = itemPrices.reduce((total, price) => total + price, 0);
            const totalPrice = subtotal + this.feeService.calculateFee(subtotal);

            const trackingNumber = await this.getTrackingNumber();
            const order = await this.orderModel.create({
                customerId: 'guest-id',
                status: 'pending',
                totalPrice: totalPrice,
                addressId: address.id,
                trackingNumber: trackingNumber,
                paymentMethod: dto.paymentMethod
            }, { transaction: t });

            await Promise.all(dto.items.map(async (item) => {
                const product = products.find(p => p.id === item.productId);
                if (!product) {
                    throw new Error(`Product ${item.productId} not found`);
                }
                await this.orderDetailModel.create({
                    orderId: order.id,
                    productId: product.id,
                    size: item.size,
                    num: item.quantity,
                    price_at_order: product.price,
                }, { transaction: t });

                await this.sizeStockModel.decrement('stock', {
                    by: item.quantity,
                    where: { productId: product.id, size: item.size },
                    transaction: t
                });
            }));

            return order;
        });
    }

    private async validateItemsAndCalculateTotal(items: OrderItemDto[], transaction) {
        const itemPrices: number[] = [];
        const products: Product[] = [];

        for (const item of items) {
            const product = await this.productModel.findOne({
                where: { id: item.productId },
                include: [{
                    model: SizeStock,
                    where: { size: item.size },
                    as: 'size_stock'
                }],
                transaction
            });

            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }

            const productPlain = product.get?.({ plain: true }) || product;
            const sizeStock = productPlain.size_stock?.[0];

            if (!sizeStock) {
                throw new Error(`Size ${item.size} not available for product ${item.productId}`);
            }

            if (sizeStock.stock < item.quantity) {
                throw new Error(`Not enough stock for product ${item.productId} (size ${item.size})`);
            }

            products.push(productPlain);
            itemPrices.push( sizeStock.price * item.quantity);
        }

        return { itemPrices, products };
    }

    async createOrderFromCart(dto: CreateOrderFromCartDto) {
        const items = await this.cartService.getItemsInCart(dto.customerId);
        if (!items || items.length === 0) {
            throw new Error('No items in cart');
        }
        console.log(items);
        const itemPrices = await Promise.all(
            items.map(async (item) => {
                const productId = item.get('product').get('id');
                const size = item.get('size');
                const num = item.get('num');
                const product = await this.productModel.findOne({
                    where: { id: productId },
                    include: [{
                        model: SizeStock,
                        where: { size: size },
                        as: 'size_stock'
                    }]
                });

                if (!product) {
                    throw new Error(`Product ${productId} not found`);
                }

                const productSizeStock = await this.productService.getSizeStockOfProduct(productId, size);
                const productSize = productSizeStock as SizeStock;
                console.log('productSize', productSize)
                if (!productSize) {
                    throw new Error(`Product Size ${productId}, ${size} not found`);
                }
                if (productSize.stock < num) {
                    throw new Error(`Not enough stock for product ${productId}`);
                }

                const productPlain = product.get?.({ plain: true }) || product;
                return productPlain.price * num;
            })
        );
        const totalPrice = itemPrices.reduce((total, price) => total + price, 0);
        let finalPrice = totalPrice;
        console.log(finalPrice);
        if (dto.voucherId !== undefined) {
            const voucher = await this.voucherService.findById(dto.voucherId);
            console.log(voucher)
            if (voucher) {
                console.log(voucher.discount)
                if (voucher.type === 'amount') {
                    finalPrice -= voucher.discount;
                } else if (voucher.type === 'percent') {
                    finalPrice -= (voucher.discount * finalPrice);
                }
                finalPrice = (finalPrice < 0 ? 0 : finalPrice);
            }
            console.log(finalPrice);
        }
        const trackingNumber = await this.getTrackingNumber();
        const order = await this.orderModel.create({
            customerId: dto.customerId,
            addressId: dto.addressId,
            totalPrice: finalPrice + this.feeService.calculateFee(0),
            status: 'pending',
            trackingNumber: trackingNumber,
            paymentMethod: dto.paymentMethod
        });
        items.map(async item => {
            const product = item.get('product');
            const num = item.get('num');
            console.log('size', item.get('size'));
            await this.orderDetailModel.create({
                orderId: order.id,
                productId: product.get('id'),
                size: item.get('size'),
                num: num,
                price_at_order: product.get('price'),
            });
            await this.sizeStockModel.decrement('stock', {
                by: num,
                where: { productId: product.get('id'), size: item.get('size') }
            });
        });
        await this.cartService.clearCart(dto.customerId);
        return order;
    }

    async getPendingOrders(customerId: string) {
        return await this.orderModel.findAll({
            where: {
                status: 'pending',
                customerId
            },
            order: [['createdAt', 'ASC']],
            include: [
                {
                    model: Customer,
                    attributes: ['id', 'name', 'mail'],
                },
                {
                    model: OrderDetail,
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'name', 'price'],
                            include: [{
                                model: ProductImages,
                                attributes: ['url'],
                            }]
                        },
                    ],
                },
            ],
        });
    }

    async getTrackingNumber() {
        const orders = await this.orderModel.count();
        const orderNumber = orders.toString().padStart(7, '0');
        const time = new Date();
        const formattedDate = time.toISOString().slice(0, 10).replace(/-/g, '');
        const trackingNumber = `ORDER_${orderNumber}_${formattedDate}`;

        return trackingNumber;
    }

    async getById(id: string) {
        return await this.orderModel.findOne({
            where: {
                id
            }
        })
    }
}