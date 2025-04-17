import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey, Default } from 'sequelize-typescript';
import { UUID } from 'crypto';
import { Customer } from './customer.model';
import { UUIDV4 } from 'sequelize';

@Table({ tableName: 'address' })
export class Address extends Model {
    @Default(UUIDV4)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    declare id: UUID;

    @ForeignKey(() => Customer)
    @Column({ type: DataType.UUID, allowNull: false })
    customerId: UUID;

    @Column({ type: DataType.STRING(100), allowNull: false })
    address: string;

    @BelongsTo(() => Customer)
    customer: Customer;
}