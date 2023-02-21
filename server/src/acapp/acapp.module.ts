import { Module } from '@nestjs/common';
import { AcappController } from './acapp.controller';
import { AcappService } from './acapp.service';

@Module({
  controllers: [AcappController],
  providers: [AcappService],
})
export class AcappModule {}
