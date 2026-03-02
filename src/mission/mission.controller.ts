import { Controller, Get } from '@nestjs/common';
import { MissionService } from './mission.service';

@Controller('missions')
export class MissionController {
    constructor(private readonly missionServicr: MissionService){}

    @Get('summary')
    getSummary(){
        return this.missionServicr.getSummary();
    }
}
