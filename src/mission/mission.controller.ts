import { Controller, Get, Param, Query } from '@nestjs/common';
import { MissionService } from './mission.service';
import type { IMission } from './mission.interface';

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
  //p03
  @Get(':id')
  getMissionById(
    @Param('id') id: string,
    @Query('clearance') clearance?: string,
  ): IMission {
    return this.missionService.findOne(id, clearance || 'STANDARD');
  }
}
