import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CdnService } from '../services/cdn.service';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Файлы')
@Controller()
export class CdnController {
  constructor(private readonly cdnService: CdnService) { }

  @ApiOperation({summary:'Получить файл'})
  @ApiResponse({status:200})
  @Get('get/:key')
  async getFile(@Param('key') key) {
    try {
      let base64buffer = (await this.cdnService.readFile(key)).toString('base64');
      return base64buffer;
    } catch (err) {
      return fs.readFileSync(`./missing.png`).toString('base64');
    }
  }


  @ApiOperation({summary:'Загрузить файл'})
  @ApiResponse({status:200})
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      return await this.cdnService.writeFile(file.buffer);
    } catch (err) {
      return err;
    }
  }


  @ApiOperation({summary:'Получить блоб'})
  @ApiResponse({status:200, type: Blob})
  @Get('getBlobSalt/:id')
  async getBlobSalt(@Param('id') id: number) {
    return await this.cdnService.getBlob(id);
  }
}