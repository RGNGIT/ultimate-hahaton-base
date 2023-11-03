import { ApiProperty } from "@nestjs/swagger";
import {Model, Table, Column, DataType, BelongsToMany, HasMany} from "sequelize-typescript";
import { Json } from "sequelize/types/utils";
import { Connection } from "../../connections/entities/connection.entity";


interface UserCreationAttrs{

}

@Table({tableName: 'users', schema: "stas_schema",  timestamps: false})
export class User extends Model<User, UserCreationAttrs>{

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({ type: DataType.STRING, allowNull: false})
    telegram_id: string;

    @Column({ type: DataType.STRING })
    telegram_chat_id: string;

    @HasMany(()=>Connection)
    connectionStrings: Connection[];

}
