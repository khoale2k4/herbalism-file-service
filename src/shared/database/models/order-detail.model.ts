import { BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Order } from "./order.model";
import { Product } from "./product.model";
import { UUID } from "crypto";
import { UUIDV4 } from "sequelize";

@Table({ tableName: 'order_details' })
export class OrderDetail extends Model {
    @PrimaryKey
    @Default(UUIDV4)
    @Column({ type: DataType.UUID, allowNull: false })
    declare id: UUID;

    @ForeignKey(() => Order)
    @Column({ type: DataType.UUID, allowNull: false })
    orderId: UUID;

    @ForeignKey(() => Product)
    @Column({ type: DataType.STRING(255), allowNull: false })
    productId: string;

    @Column({ type: DataType.STRING(20), allowNull: false })
    size: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    num: number;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
    price_at_order: number;

    @BelongsTo(() => Order)
    order: Order;

    @BelongsTo(() => Product)
    product: Product;
}