import { Injectable, UnprocessableEntityException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/users.repository';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user-roles.enum';
import { CredentialsDTO } from '../users/dtos/credentials.dto';
// Com o UserRepository adicionado ao Módulo
// agora posso criar o método para criação de um usuário comum

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserRepository)
  private userRepository: UserRepository
  ) { }

  //Método de cadastro
  async signUp(createUserDto: CreateUserDto): Promise<User> {
    if(createUserDto.password !== createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      return await this.userRepository.createUser(createUserDto, UserRole.USER);
    }
  }

  //Método de Login
  async signIn(credentialsDto: CredentialsDTO) {
    const user = await this.userRepository.checkCredentials(credentialsDto);

    if(user === null) {
      throw new UnauthorizedException('Credenciais inválidas')
    }
  }

}
