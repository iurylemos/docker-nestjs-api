import { UserRole } from '../user-roles.enum';
import { IsString, IsEmail, IsOptional } from 'class-validator';
/*
  DTO para representar o conjunto de dados de um usuário que poderão ser alterados
*/

export class UpdateUserDto {

  @IsOptional()
  @IsString({ message: 'Informe um nome de usuário válido' })
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Informe um endereço de e-mail válido' })
  email: string;

  @IsOptional()
  role: UserRole;

  @IsOptional()
  status: boolean;
}