import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, HasMany, Table } from "sequelize-typescript";


@Table
export class Blob extends Model<Blob> {
  @ApiProperty({example:"", description:"*блоб-блоб*"})
  @Column
  key: string;

}