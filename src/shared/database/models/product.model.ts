import { Table, Column, Model, DataType, HasMany, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Comment } from './comment.model';
import { OrderDetail } from './order-detail.model';
import { CartItem } from './cart-item.model';
import { UUID } from 'crypto';
import { SizeStock } from './size_stock.model';
import { UUIDV4 } from 'sequelize';
import { ProductTypes } from './product-type.model';
import { ProductForms } from './product-form.model';
import { WellnessNeeds } from './wellness-needs.model';
import { ProductImages } from './product-image.dto';
import { ProductTabs } from './product-tabs.model';

@Table({ tableName: 'products' })
export class Product extends Model {
    @Default(UUIDV4)
    @Column({
        type: DataType.STRING(255),
        primaryKey: true,
    })
    declare id: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    name: string;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
    price: number;

    @Column({ type: DataType.FLOAT, defaultValue: 0 })
    rate: number; 

    @Column({ type: DataType.TEXT })
    content: string;

    @HasMany(() => Comment)
    comments: Comment[];

    @ForeignKey(() => ProductTypes)
    @Column({ type: DataType.UUID, allowNull: false })
    typeId: UUID;

    @ForeignKey(() => ProductForms)
    @Column({ type: DataType.UUID, allowNull: false })
    formId: UUID;

    @ForeignKey(() => WellnessNeeds)
    @Column({ type: DataType.UUID, allowNull: false })
    needId: UUID;

    @BelongsTo(() => ProductTypes)
    type: ProductTypes;
  
    @BelongsTo(() => ProductForms)
    form: ProductForms;
  
    @BelongsTo(() => WellnessNeeds)
    need: WellnessNeeds;

    @HasMany(() => OrderDetail)
    orderDetails: OrderDetail[];

    @HasMany(() => CartItem)
    cartItems: CartItem[];

    @HasMany(() => SizeStock)
    size_stock: SizeStock[]

    @HasMany(() => ProductImages)
    images: ProductImages[]

    @HasMany(() => ProductTabs)
    tabs: ProductTabs[]
}