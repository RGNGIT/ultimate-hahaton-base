import { ApiProperty } from "@nestjs/swagger";
import { Model, Table, Column, DataType, BelongsToMany, HasMany } from "sequelize-typescript";
import { Json } from "sequelize/types/utils";
import { Connection } from "../../connections/entities/connection.entity";

@Table({ tableName: 'statuses', schema: "stas_schema", timestamps: false })
export class Status extends Model {

  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  oid: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  sessions: number;

  @Column({ type: DataType.DOUBLE })
  idle_in_transaction: number;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;
}
