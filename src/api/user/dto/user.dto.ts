import { IsString } from 'class-validator';
export class UpdateDto {
  @IsString()
  phone: string;

  @IsString()
  avatar: string;
}
