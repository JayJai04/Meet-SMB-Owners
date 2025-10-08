import { IsString, MinLength} from 'class-validator';

export class CreateGroupDto {
  @IsString()
  readonly cityId: string;

  @IsString()
  @MinLength(8)
  readonly groupName:string;
}