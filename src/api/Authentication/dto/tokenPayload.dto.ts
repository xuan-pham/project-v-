import { IsNumber } from 'class-validator';

export class TokenPayloadDto {
  @IsNumber()
  id: number;
}
