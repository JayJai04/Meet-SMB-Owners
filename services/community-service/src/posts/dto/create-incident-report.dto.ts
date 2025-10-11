import { IsEnum, IsString, IsNumber, IsDateString, IsOptional, MinLength } from 'class-validator';
import { IncidentCategory } from '../entities/incident-report.entity';

export class CreateIncidentReportDto {
  @IsDateString()
  readonly incidentTimestamp: string;

  @IsString()
  @MinLength(10)
  readonly incidentAddress: string;

  @IsNumber()
  readonly latitude: number;

  @IsNumber()
  readonly longitude: number;

  @IsEnum(IncidentCategory)
  readonly incidentCategory: IncidentCategory;

  @IsString()
  @MinLength(20)
  readonly description: string;

  @IsString()
  readonly groupId: string;
}

