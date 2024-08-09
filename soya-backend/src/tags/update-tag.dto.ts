import { IsString } from 'class-validator';

export class UpdateTagDTO {
  @IsString()
  name: string;
}
