export interface IMission {
  id: string;
  codename: string;
  status: string;
  targetName: string;
  riskLevel: string;
  startDate?: number;
  endDate?: number | null;
}
