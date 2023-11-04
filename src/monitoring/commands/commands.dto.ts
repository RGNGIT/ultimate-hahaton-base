import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Commands } from "./commands.enum";


export class CommandDto {

  @ApiProperty({ description: "Хост подключения" })
  host: string;

  @ApiProperty({ description: "Команда для выполнения" })
  command: string;

}
