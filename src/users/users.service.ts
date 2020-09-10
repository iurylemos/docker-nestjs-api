import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UserRole } from './user-roles.enum';

// camada de serviço do módulo, responsável por tratar da lógica básica
// por trás da execução de nossos endpoints

// OBS:
// Decorator @Injectable que é o responsável 
// por fazer com que nossa classe faça parte do sistema de Injeção de Dependências do NestJS

//O serviço irá utilizá-lo para comunicar-se com o banco de dados

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  // Método createAdminUser que será responsável por tratar da criação de nosso usuário administrador
  
  async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
    if(createUserDto.password !== createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      return this.userRepository.createUser(createUserDto, UserRole.ADMIN)
    }
    
  }
}
