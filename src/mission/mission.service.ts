import { Injectable, NotFoundException } from '@nestjs/common';
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
  private readonly filePath = path.join(process.cwd(), 'data', 'missions.json');
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
      const start = new Date(mission.startDate as number);
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
  //p03
  findOne(id: string, clearance: string = 'STANDARD'): IMission {
    const fileData = fs.readFileSync(this.filePath, 'utf-8');
    const missions: IMission[] = JSON.parse(fileData) as IMission[];

    const mission = missions.find((m) => m.id === id);

    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    const isSensitive =
      mission.riskLevel === 'HIGH' || mission.riskLevel === 'CRITICAL';
    const isAuthorized = clearance === 'TOP_SECRET';

    if (isSensitive && !isAuthorized) {
      return {
        ...mission,
        targetName: '***REDACTED***',
      };
    }

    return mission;
  }
  //p04
  create(body: IMission): IMission {
    // 1. อ่านข้อมูลเดิมจากไฟล์ 
    const fileData = fs.readFileSync(this.filePath, 'utf-8');
    const missions: IMission[] = JSON.parse(fileData) as IMission[];

    // 2. คำนวณ ID 
    const lastId =
      missions.length > 0
        ? Math.max(...missions.map((m) => parseInt(m.id)))
        : 0;
    const newId = (lastId + 1).toString();

    // 3. สร้าง Object ภารกิจใหม่
    const newMission: IMission = {
      id: newId,
      status: 'ACTIVE',
      endDate: null,
      codename: body.codename,
      riskLevel: body.riskLevel,
      targetName: body.targetName,
      startDate: body.startDate,
    };

    // 4. บันทึกลง Array และเขียนทับไฟล์เดิม
    missions.push(newMission);
    fs.writeFileSync(this.filePath, JSON.stringify(missions, null, 2), 'utf-8');

    return newMission;
  }
}
