import { UUID } from "crypto";
import { UUIDV4 } from "sequelize";
import { BelongsTo, Column, DataType, Default, ForeignKey, Model, Table } from "sequelize-typescript";
import { Customer } from "./customer.model";

@Table({ tableName: 'cart' })
export class Cart extends Model {
    @Default(UUIDV4)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    declare id: UUID;
    
    @ForeignKey(() => Customer)
    @Column({ type: DataType.UUID })
    customerId: UUID;

    @BelongsTo(() => Customer)
    customer: Customer;
}