import { UUID } from "crypto";
import { UUIDV4 } from "sequelize";
import { Column, DataType, Default, HasMany, Model, Table } from "sequelize-typescript";
import { Product } from "./product.model";

@Table({ tableName: 'voucher' })
export class Voucher extends Model {
    @Column({
        type: DataType.STRING(255),
        primaryKey: true,
    })
    declare id: UUID;

    @Column({ type: DataType.FLOAT, allowNull: false })
    discount: number;

    @Column({
        type: DataType.ENUM('percent', 'amount'),
        defaultValue: 'percent'
    })
    type: string;
}