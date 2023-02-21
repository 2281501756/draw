import { Controller, Get, Query } from '@nestjs/common';
import { AcappService } from './acapp.service';

@Controller('acapp')
export class AcappController {
  constructor(private service: AcappService) {}

  @Get('apply/code')
  apply() {
    return this.service.apply_code();
  }
  @Get('receive/code')
  receive(@Query() query) {
    return this.service.receive_code(query);
  }
}
