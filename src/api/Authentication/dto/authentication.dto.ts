import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/commons/role/enum/role.enum';

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

export class ChangeRole {
  @ApiProperty({
    example: Role.Admin,
  })
  @IsEnum(Role)
  role: Role;
}
