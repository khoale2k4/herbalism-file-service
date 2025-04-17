import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Default, HasMany } from 'sequelize-typescript';
import { Admin } from './admin.model';
import { UUID } from 'crypto';
import { UUIDV4 } from 'sequelize';
import { ArticleCategory } from './article-category.model';

@Table({ tableName: 'articles' })
export class Article extends Model {
    @Default(UUIDV4)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    declare id: UUID;
    
    @ForeignKey(() => ArticleCategory)
    @Column({ type: DataType.UUID })
    categoryId: string;

    @BelongsTo(() => ArticleCategory)
    category: ArticleCategory;

    @Column({ type: DataType.STRING(255), allowNull: false })
    title: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    imageUrl: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    shortDescription: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    content: string;

    @ForeignKey(() => Admin)
    @Column({ type: DataType.UUID, allowNull: false })
    adminId: UUID;

    @BelongsTo(() => Admin)
    author: Admin;
}