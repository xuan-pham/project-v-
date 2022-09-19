import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFriends {
  @ApiProperty({
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
