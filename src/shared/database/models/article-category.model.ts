import { UUID } from "crypto";
import { UUIDV4 } from "sequelize";
import { Model, Table, Default, Column, DataType, HasMany } from "sequelize-typescript";
import { Product } from "./product.model";
import { Article } from "./article.model";

@Table({ tableName: 'articleCategories' })
export class ArticleCategory extends Model {
    @Default(UUIDV4)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    declare id: UUID;

    @Column({ type: DataType.STRING(255), allowNull: false })
    name: string;

    @HasMany(() => Article)
    articles: Article[];
}