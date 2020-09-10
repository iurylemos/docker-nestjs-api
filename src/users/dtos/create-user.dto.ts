import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

// Um DTO é um objeto que será composto pelos dados que serão utilizados entre diferentes
// métodos da aplicação com um objetivo em comum

export class CreateUserDto {
  @IsNotEmpty({ message: 'Informe um endereço de e-mail' })
  @IsEmail({}, { message: 'Informe um endereço de e-mail válido' })
  @MaxLength(200, { message: 'O endereço de e-mail deve ter menos de 200 caracteres' })
  email: string;

  @IsNotEmpty({ message: 'Informe o nome de usuário' })
  @MaxLength(200, { message: 'O nome de usuário deve ter menos de 200 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'Informe uma senha' })
  @MinLength(6, { message: 'A senha deve conter no minímo 6 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'Informe uma senha' })
  @MinLength(6, { message: 'A senha deve conter no minímo 6 caracteres' })
  passwordConfirmation: string;
}