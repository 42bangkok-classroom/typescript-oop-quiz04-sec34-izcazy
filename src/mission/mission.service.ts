import { Injectable } from '@nestjs/common';
import { IMission } from './mission.interface';
import process from 'process';
import path from 'path';
import * as fs from 'fs';

@Injectable()
//p01
export class MissionService {
  private readonly missions = [
    { id: 1, codename: 'OPERATION_STORM', status: 'ACTIVE' },
    { id: 2, codename: 'SILENT_SNAKE', status: 'COMPLETED' },
    { id: 3, codename: 'RED_DAWN', status: 'FAILED' },
    { id: 4, codename: 'BLACKOUT', status: 'ACTIVE' },
    { id: 5, codename: 'ECHO_FALLS', status: 'COMPLETED' },
    { id: 6, codename: 'GHOST_RIDER', status: 'COMPLETED' },
  ];
  getSummary() {
    let active: number = 0;
    let completed: number = 0;
    let failed: number = 0;

    for (const mission of this.missions) {
      const status = mission.status;
      if (status === 'ACTIVE') {
        active++;
      } else if (status === 'COMPLETED') {
        completed++;
      } else {
        failed++;
      }
    }
    return {
      ACTIVE: active,
      COMPLETED: completed,
      FAILED: failed,
    };
  }
  //p02
  findAll(): IMission[] {
    const filePath = path.join(process.cwd(), 'data', 'missions.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    // ใช้ as IMission[] เพื่อเลี่ยง Unsafe assignment error
    const missions: IMission[] = JSON.parse(fileData) as IMission[];

    return missions.map((mission) => {
      // เงื่อนไข: ถ้า endDate เป็น null ให้ส่ง -1
      if (!mission.endDate) {
        return { ...mission, durationDays: -1 };
      }

      // คำนวณระยะเวลา
      const start = new Date(mission.startDate as string);
      const end = new Date(mission.endDate);
      
      // สูตร: (ปลายทาง - ต้นทาง) / เวลา 1 วันในหน่วย ms
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        ...mission,
        durationDays: diffDays,
      };
    });
  }
}
