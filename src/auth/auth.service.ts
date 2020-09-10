import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/users.repository';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user-roles.enum';
// Com o UserRepository adicionado ao Módulo
// agora posso criar o método para criação de um usuário comum

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserRepository)
  private userRepository: UserRepository
  ) { }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    if(createUserDto.password !== createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      return await this.userRepository.createUser(createUserDto, UserRole.USER);
    }
  }

}
