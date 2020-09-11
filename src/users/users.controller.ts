import { Controller, Post, Body, ValidationPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ReturnUserDto } from './dtos/return-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.decorator';
import { UserRole } from './user-roles.enum';

// O parâmentro ‘users’ passado para o Decorator @Controller 
// serve para indicar que esse controller irá tratar das requisições feitas 
// para a URI http://localhost:3000/users.
// Foi adicionado ao controller o endpoint responsável pela criação de um usuário admin
// e que retornará o usuário criado, bem como uma mensagem de sucesso.

@Controller('users')
export class UsersController {
  constructor(private userServices: UsersService) {}

  // Utilizamos o Decorator @Post 
  // como forma de identificar o método HTTP que deverá ser utilizado para acessar a rota. 
  // OBS: Podemos passar como parâmetro para esse Decorator o caminho da URI que ele irá tratar
  
  // passando o parâmetro ValidationPipe para o decorator @Body que realiza a extração de dados da requisição
  // E a validação dos campos no DTO sejam ativadas

  
  @Post()
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async createAdminUser(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    const user = await this.userServices.createAdminUser(createUserDto);
    return {
      user,
      message: 'Admininstrador cadastrador com sucesso!'
    }
  }
}
