import { PartialType } from '@nestjs/mapped-types';
import CreateUserDto from './create-user.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'


export default class UpdateUserDto extends PartialType(CreateUserDto) {

}