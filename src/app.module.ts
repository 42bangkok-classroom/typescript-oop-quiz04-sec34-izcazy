import { Module } from '@nestjs/common';
import { MissionController } from './mission/mission.controller';
import { MissionService } from './mission/mission.service';
import { MissionModule } from './mission/mission.module';

@Module({
  imports: [MissionModule],
  controllers: [MissionController],
  providers: [MissionService],
})
export class AppModule {}
