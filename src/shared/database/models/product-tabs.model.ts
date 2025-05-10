import { UUID } from "crypto";
import { UUIDV4 } from "sequelize";
import { Column, DataType, Default, ForeignKey, Model, Table } from "sequelize-typescript";
import { Product } from "./product.model";

@Table({ tableName: 'productTabs' })
export class ProductTabs extends Model {
    @Default(UUIDV4)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    declare id: UUID;
    
    @ForeignKey(() => Product)
    @Column({ type: DataType.STRING(255), allowNull: false })
    productId: UUID;

    @Column({ type: DataType.STRING(255), allowNull: false })
    name: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    description: string;
}