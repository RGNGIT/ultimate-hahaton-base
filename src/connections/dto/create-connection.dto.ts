import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";


export class CreateConnectionDto {
  // @ApiProperty({ description: "Строка подключения" })
  // connectionString: string;
  @ApiProperty({ description: "Хост подключения" })
  host: string;
  @ApiProperty({ description: "Порт подключения" })
  port: string; 
  @ApiProperty({ description: "Имя пользователя СУБД" })
  username: string; 
  @ApiProperty({ description: "Пароль СУБД" })
  password: string; 


  @ApiPropertyOptional({ description: "Название подключения" })
  name?: string;
  @ApiProperty({ description: "Идентификатор пользователя в базе данных" })
  telegram_id: string;
}
