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
    firstName: string;

    @Column({ type: DataType.STRING(100), allowNull: false })
    lastName: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    address: string;

    @Column({ type: DataType.STRING(100), allowNull: false })
    country: string;

    @Column({ type: DataType.STRING(100), allowNull: true })
    apartment: string;

    @Column({ type: DataType.STRING(100), allowNull: false })
    city: string;

    @Column({ type: DataType.STRING(100), allowNull: false })
    province: string;

    @Column({ type: DataType.STRING(100), allowNull: false })
    zipCode: string;

    @BelongsTo(() => Customer)
    customer: Customer;
}