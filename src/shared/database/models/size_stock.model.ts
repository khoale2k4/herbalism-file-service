import { Table, Column, Model, DataType, HasMany, ForeignKey, PrimaryKey, Default } from 'sequelize-typescript';
import { Comment } from './comment.model';
import { OrderDetail } from './order-detail.model';
import { CartItem } from './cart-item.model';
import { UUID } from 'crypto';
import { Product } from './product.model';
import { UUIDV4 } from 'sequelize';

@Table({ tableName: 'size_stock' })
export class SizeStock extends Model {
    @PrimaryKey
    @Default(UUIDV4)
    @Column({ type: DataType.UUID, allowNull: false })
    declare id: UUID;

    @ForeignKey(() => Product)
    @Column({ type: DataType.UUID, allowNull: false })
    productId: UUID;

    @Column({ type: DataType.STRING(255), allowNull: false })
    size: string;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
    stock: number;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
    price: number;
}