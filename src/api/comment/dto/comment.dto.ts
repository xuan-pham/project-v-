import { ApiBody, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CommentDto {

  @ApiProperty({
    example: 'test',
  })
  @IsNotEmpty()
  comment: string;
}
