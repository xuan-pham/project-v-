import { IsEmail, IsNotEmpty, IsString, } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccount {
  @ApiProperty({
    example: 'ducpx@vmodev.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'xuanpham',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'ducpx@vmodev.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ForgotPassDto {
  @ApiProperty({
    example: 'ducpx@vmodev.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ChangePassDto {
  @ApiProperty({
    example: '123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '123',
  })
  @IsString()
  @IsNotEmpty()
  passwordConfirm: string;
}
