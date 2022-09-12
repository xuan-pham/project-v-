import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CommentDto {
  @ApiProperty({
    example: 'test',
  })
  @IsNotEmpty()
  comment: string;
}
