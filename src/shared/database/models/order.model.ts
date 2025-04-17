import { Table, Column, Model, ForeignKey, BelongsTo, HasMany, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import { Customer } from './customer.model';
import { OrderDetail } from './order-detail.model';
import { UUID } from 'crypto';
import { UUIDV4 } from 'sequelize';

@Table({ tableName: 'orders' })
export class Order extends Model {
    @PrimaryKey
    @Default(UUIDV4)
    @Column({ type: DataType.UUID, primaryKey: true })
    declare id: UUID;

    @ForeignKey(() => Customer)
    @Column({ type: DataType.UUID, allowNull: false })
    customerId: UUID;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
    totalPrice: number;

    @Column({
        type: DataType.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    })
    status: string;

    @BelongsTo(() => Customer)
    customer: Customer;

    @HasMany(() => OrderDetail)
    orderDetails: OrderDetail[];
}