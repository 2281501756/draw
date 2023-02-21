import { Module } from '@nestjs/common';
import { GatewayModule } from 'src/gateway/gateway.module';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [GatewayModule],
})
export class RoomModule {}
