import { ApiProperty } from "@nestjs/swagger";
import { Model, Table, Column, DataType, BelongsToMany, HasMany } from "sequelize-typescript";

export enum LogType{
    warning = "Предупреждение",
    error = "Ошибка", 
    info = "Инфо"
}

@Table({ tableName: 'log', schema: "stas_schema", timestamps: false })
export class Log extends Model {

  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  host: number;

  @Column({ type: DataType.STRING })
  message: number;

  @Column({ type: DataType.STRING, defaultValue: LogType.info })
  type: LogType;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;
}

