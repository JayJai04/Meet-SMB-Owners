import { IsString, MinLength, IsNumber} from 'class-validator';

export class CreateGroupDto {
  @IsNumber()
  readonly cityId: number;

  @IsString()
  @MinLength(8)
  readonly groupName:string;
}