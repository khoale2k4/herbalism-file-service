import { UUID } from "crypto";
import { UUIDV4 } from "sequelize";
import { Column, DataType, Default, Model, Table } from "sequelize-typescript";

@Table({ tableName: 'wellnessNeeds' })
export class WellnessNeeds extends Model {
    @Default(UUIDV4)
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    declare id: UUID;

    @Column({ type: DataType.STRING(255), allowNull: false })
    name: string;
}