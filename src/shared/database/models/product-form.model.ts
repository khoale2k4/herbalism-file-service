import { UUID } from "crypto";
import { UUIDV4 } from "sequelize";
import { Column, DataType, Default, HasMany, Model, Table } from "sequelize-typescript";
import { Product } from "./product.model";

@Table({ tableName: 'productForms' })
export class ProductForms extends Model {
    @Default(UUIDV4)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    declare id: UUID;

    @Column({ type: DataType.STRING(255), allowNull: false })
    name: string;
    
    @HasMany(() => Product)
    products: Product[];
}