import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePostDto {
    @IsString()
    title: string;
}
