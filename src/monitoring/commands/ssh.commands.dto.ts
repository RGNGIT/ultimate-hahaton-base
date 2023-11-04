import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Commands } from "./commands.enum";


export class SshCommandDto {

  @ApiProperty({ description: "Хост подключения" })
  host: string;

  @ApiProperty({ description: "Имя пользователя" })
  username: string;

  @ApiProperty({ description: "Пароли" })
  password: string;

  @ApiProperty({ description: "Команда для выполнения" })
  command: string;

}
