import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class FeedQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  type?: 'all' | 'incidents' | 'events' = 'all';
}
