import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class UpdateUserDto {
  @ApiProperty({
    example: '0332220298',
  })
  @IsNotEmpty()
  phone: string;
}
