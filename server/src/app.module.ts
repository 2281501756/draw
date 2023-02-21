import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { RoomModule } from './room/room.module';
import { FileModule } from './file/file.module';
import { AcappModule } from './acapp/acapp.module';

@Module({
  imports: [GatewayModule, RoomModule, FileModule, AcappModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
