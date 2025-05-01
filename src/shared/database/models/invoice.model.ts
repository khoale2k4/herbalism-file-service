import { UUID } from "crypto";
import { BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UUIDV4 } from 'sequelize';
import { Order } from "./order.model";

@Table({ tableName: 'invoice' })
export class Invoice extends Model {
    @PrimaryKey
    @Default(UUIDV4)
    @Column({ type: DataType.UUID, primaryKey: true })
    declare id: UUID;

    @ForeignKey(() => Order)
    @Column({ type: DataType.UUID, allowNull: false })
    orderId: UUID;

    @Column({ type: DataType.TEXT, allowNull: false })
    paymentMethod: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    transactionId: string;

    @Column({
        type: DataType.ENUM("pending", "paid", "failed"),
        defaultValue: 'pending'
    })
    status: string;
    
    @BelongsTo(() => Order)
    order: Order;
}