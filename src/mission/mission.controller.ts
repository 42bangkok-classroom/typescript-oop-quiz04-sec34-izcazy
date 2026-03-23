import { Controller, Get } from '@nestjs/common';
import { MissionService } from './mission.service';
import { IMission } from './mission.interface';

@Controller('missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}
  //p01
  @Get('summary')
  getSummary() {
    return this.missionService.getSummary();
  }
  //p02
  @Get()
  getMissions(): IMission[] {
    return this.missionService.findAll();
  }
}
