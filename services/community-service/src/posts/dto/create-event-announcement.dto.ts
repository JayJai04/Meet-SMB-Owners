import { IsEnum, IsString, IsNumber, IsDateString, IsOptional, MinLength, IsBoolean } from 'class-validator';
import { EventType } from '../entities/event-announcement.entity';

export class CreateEventAnnouncementDto {
  @IsString()
  @MinLength(5)
  readonly title: string;

  @IsString()
  @MinLength(20)
  readonly description: string;

  @IsEnum(EventType)
  readonly eventType: EventType;

  @IsOptional()
  @IsDateString()
  readonly eventStartDate?: string;

  @IsOptional()
  @IsDateString()
  readonly eventEndDate?: string;

  @IsOptional()
  @IsString()
  readonly location?: string;

  @IsOptional()
  @IsNumber()
  readonly latitude?: number;

  @IsOptional()
  @IsNumber()
  readonly longitude?: number;

  @IsBoolean()
  readonly isUrgent?: boolean;

  @IsString()
  readonly groupId: string;
}

