import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export default class CreateUserDto {
  @ApiProperty({description: 'Id пользователя в Telegram'})
  telegram_id: string;
  @ApiProperty({description: 'Id чата с ботом в Telegram'})
  telegram_chat_id: string;
}