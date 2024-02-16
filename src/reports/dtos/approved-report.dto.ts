import { IsBoolean, isBoolean } from 'class-validator';

export class ApprovedReportDto {
  @IsBoolean()
  approved: boolean;
}
