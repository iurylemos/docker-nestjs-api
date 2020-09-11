import { Controller, Post, Body, ValidationPipe, UseGuards, Get, Param, Patch, ForbiddenException, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ReturnUserDto } from './dtos/return-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.decorator';
import { UserRole } from './user-roles.enum';
import { UpdateUserDto } from './dtos/update-users.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from './user.entity';

// O parâmentro ‘users’ passado para o Decorator @Controller 
// serve para indicar que esse controller irá tratar das requisições feitas 
// para a URI http://localhost:3000/users.
// Foi adicionado ao controller o endpoint responsável pela criação de um usuário admin
// e que retornará o usuário criado, bem como uma mensagem de sucesso.

/*
  Ao invés de protegermos endpoint por endpoint da nossa aplicação, 
  podemos colocar nosso decorator @UseGuards junto ao nosso decorator @Controller
*/

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
  constructor(private userServices: UsersService) {}

  // Utilizamos o Decorator @Post 
  // como forma de identificar o método HTTP que deverá ser utilizado para acessar a rota. 
  // OBS: Podemos passar como parâmetro para esse Decorator o caminho da URI que ele irá tratar
  
  // passando o parâmetro ValidationPipe para o decorator @Body que realiza a extração de dados da requisição
  // E a validação dos campos no DTO sejam ativadas

  
  @Post()
  @Role(UserRole.ADMIN)
  async createAdminUser(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    const user = await this.userServices.createAdminUser(createUserDto);
    return {
      user,
      message: 'Admininstrador cadastrador com sucesso!'
    }
  }

  @Get(':id')
  @Role(UserRole.ADMIN)
  async findUserById(@Param('id') id): Promise<ReturnUserDto> {
    const user = await this.userServices.findUserById(id);
    return {
      user,
      message: 'Usuário não encontrado'
    }
  }

  /*
    Além de utilizarmos um novo verbo HTTP (PATCH), 
    combinamos o uso do decorator @Body com o decorator @Param. 
    Também fizemos uso do decorator @GetUser, criado por nós mesmo no tutorial anterior.
    Também realizamos uma pequena validação de permissão, 
    já que além de um usuário administrador poder alterar dados dos outros usuários, 
    também precisamos dar a permissão para que um usuário possa alterar seus próprios dados.
  */

  @Patch(':id')
  async updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
    @Param('id') id: string
  ) {
    if(user.role !== UserRole.ADMIN && user.id.toString() !== id) {
      throw new ForbiddenException('Você não tem autorização para acessar esse recurso')
    } else {
      return this.userServices.updateUser(updateUserDto, id);
    }
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    await this.userServices.deleteUser(id);
    return {
      message: 'Usuário removido com sucesso'
    }
  }
}
