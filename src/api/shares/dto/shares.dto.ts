import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShareDto {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
