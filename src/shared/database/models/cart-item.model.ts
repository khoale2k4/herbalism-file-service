import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Default } from 'sequelize-typescript';
import { Product } from './product.model';
import { UUID } from 'crypto';
import { UUIDV4 } from 'sequelize';
import { Cart } from './cart.model';

@Table({ tableName: 'cart_items' })
export class CartItem extends Model {
    @Default(UUIDV4)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    declare id: UUID;

    @Column({ type: DataType.INTEGER, allowNull: false })
    num: number;

    @Column({ type: DataType.STRING(20), allowNull: false })
    size: string;

    @ForeignKey(() => Cart)
    @Column({ type: DataType.UUID, allowNull: false })
    cartId: UUID;

    @ForeignKey(() => Product)
    @Column({ type: DataType.STRING(255), allowNull: false })
    productId: string;

    @BelongsTo(() => Cart)
    cart: Cart;

    @BelongsTo(() => Product)
    product: Product;
}