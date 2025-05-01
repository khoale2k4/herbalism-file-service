import { Table, Column, Model, DataType, HasMany, Default, BelongsTo, ForeignKey, Unique } from 'sequelize-typescript';
import { Order } from './order.model'
import { Comment } from './comment.model'
import { UUID } from 'crypto';
import { Address } from './address.model';
import { UUIDV4 } from 'sequelize';
import { Cart } from './cart.model';

@Table({ tableName: 'customers' })
export class Customer extends Model {
    @Default(UUIDV4)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    declare id: UUID;

    @Column({ type: DataType.STRING(100), allowNull: false })
    name: string;

    @Unique
    @Column({ type: DataType.STRING(255), unique: true, allowNull: false })
    mail: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    password: string;

    @Column({ type: DataType.STRING(20) })
    phone: string;

    @HasMany(() => Order)
    orders: Order[];

    @HasMany(() => Comment)
    comments: Comment[];

    @HasMany(() => Cart)
    cart: Cart;

    @HasMany(() => Address)
    address: Address[];
}