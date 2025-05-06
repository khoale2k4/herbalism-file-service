import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey, Default } from 'sequelize-typescript';
import { UUID } from 'crypto';
import { Customer } from './customer.model';
import { UUIDV4 } from 'sequelize';

@Table({ tableName: 'mail' })
export class Mail extends Model {
    @Default(UUIDV4)
    @Column({
        type: DataType.STRING(100),
        primaryKey: true,
    })
    declare id: string;
}