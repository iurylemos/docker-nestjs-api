import { Injectable, UnprocessableEntityException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UserRole } from './user-roles.enum';
import { UpdateUserDto } from './dtos/update-users.dto';

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
  ) { }

  // Método createAdminUser que será responsável por tratar da criação de nosso usuário administrador

  async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password !== createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      return this.userRepository.createUser(createUserDto, UserRole.ADMIN)
    }
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne(userId, {
      select: ['email', 'name', 'role', 'id']
    })

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
    const user = await this.findUserById(id)
    const { name, email, role, status } = updateUserDto;
    user.name = name ? name : user.name;
    user.email = email ? email : user.email
    user.role = role ? role : user.role
    user.status = status === undefined ? user.status : status;
    try {
      await user.save();
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error ao salvar os dados no banco de dados')
    }
  }

  async deleteUser(userId: string) {
    const result = await this.userRepository.delete({ id: userId })
    if(result.affected === 0) {
      throw new NotFoundException('Não foi encontrado um usuário com o ID informado')
    }
  }
}
