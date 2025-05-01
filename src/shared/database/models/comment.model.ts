import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Default, PrimaryKey } from 'sequelize-typescript';
import { Product } from './product.model';
import { Customer } from './customer.model';
import { UUID } from 'crypto';
import { UUIDV4 } from 'sequelize';

@Table({ tableName: 'comments' })
export class Comment extends Model {
    @PrimaryKey
    @Default(UUIDV4)
    @Column({
        type: DataType.UUID,
    })
    declare id: UUID;

    @Column({ type: DataType.TEXT, allowNull: false })
    content: string;

    @Column({ type: DataType.INTEGER, allowNull: true })
    rate: number;

    @ForeignKey(() => Product)
    @Column({ type: DataType.UUID, allowNull: false })
    productId: UUID;

    @ForeignKey(() => Customer)
    @Column({ type: DataType.UUID, allowNull: true })
    customerId: UUID;

    @BelongsTo(() => Product)
    product: Product;

    @BelongsTo(() => Customer)
    customer?: Customer;
}