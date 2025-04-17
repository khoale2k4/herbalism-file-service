import { Table, Column, Model, DataType, HasMany, Default } from 'sequelize-typescript';
import { Article } from './article.model';
import { UUID } from 'crypto';
import { UUIDV4 } from 'sequelize';

@Table({ tableName: 'admins' })
export class Admin extends Model {
    @Default(UUIDV4)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    declare id: UUID;

    @Column({ type: DataType.STRING(100), allowNull: false })
    name: string;

    @Column({ type: DataType.STRING(255), unique: true, allowNull: false })
    mail: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    password: string;

    @HasMany(() => Article)
    articles: Article[];
}