import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  Email!: string;

  @IsNotEmpty()
  @MinLength(6)
  Password!: string;
}
