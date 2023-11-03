import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export default class CreateUserDto {
  telegram_id: string;
}