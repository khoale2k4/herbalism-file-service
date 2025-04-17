import { Table, Column, Model, DataType, HasMany, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { UUID } from 'crypto';
import { UUIDV4 } from 'sequelize';
import { Product } from './product.model';

@Table({ tableName: 'productImages' })
export class ProductImages extends Model {
    @Default(UUIDV4)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    declare id: UUID;

    @ForeignKey(() => Product)
    @Column({ type: DataType.UUID, allowNull: false })
    productId: UUID;

    @BelongsTo(() => Product)
    product: Product;

    @Column({ type: DataType.TEXT })
    url: string;
}