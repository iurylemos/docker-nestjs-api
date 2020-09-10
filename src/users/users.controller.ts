import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ReturnUserDto } from './dtos/return-user.dto';

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
  // OBS: Podemos passar como parâmetro para esse Decorator o caminho da URI que ele irá tratar.
  
  @Post()
  async createAdminUser(@Body() createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    const user = await this.userServices.createAdminUser(createUserDto);
    return {
      user,
      message: 'Admininstrador cadastrador com sucesso!'
    }
  }
}
