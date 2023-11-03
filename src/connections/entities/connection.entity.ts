import { ApiProperty } from "@nestjs/swagger";
import {Model, Table, Column, DataType, ForeignKey, BelongsTo} from "sequelize-typescript";
import { User } from "../../user/entities/user.entity";


interface ConnectionCreationAttrs{

}

@Table({tableName: 'connections', schema: "stas_schema",  timestamps: false})
export class Connection extends Model<Connection, ConnectionCreationAttrs>{

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @Column({type: DataType.STRING} )
    name: string;

    @Column({type: DataType.STRING, allowNull: false} )
    connectionString: string;

    @ForeignKey(()=>User)
    @Column({type: DataType.INTEGER})
    user_id: number;

    @BelongsTo(()=>User)
    user: User;

}
