import { Module } from '@nestjs/common';
import { CdnController } from './controllers/cdn.controller';
import { CdnService } from './services/cdn.service';
import { blobProvider } from './providers/blob.provider';

@Module({
  imports: [],
  controllers: [CdnController],
  providers: [CdnService, ...blobProvider]
})

export class CdnModule { }