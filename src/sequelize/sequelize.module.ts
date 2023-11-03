import { Module } from '@nestjs/common';
import { dbProviders } from './providers/database.providers';

@Module({
  providers: [...dbProviders],
  exports: [...dbProviders],
})

export class SequelizeModule { }