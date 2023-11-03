import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";


export class CreateConnectionDto {
  @ApiProperty({ description: "Строка подключения" })
  connectionString: string;
  @ApiPropertyOptional({ description: "Название подключения" })
  name?: string;
  @ApiProperty({ description: "Идентификатор пользователя в базе данных" })
  user_id: number;
}
