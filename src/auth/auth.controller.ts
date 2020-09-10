import { Controller, Post, Body, ValidationPipe, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { CredentialsDTO } from '../users/dtos/credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.entity';
import { GetUser } from './get-user.decorator';

/*
  Usamos agora o decorator @UseGuards(). 
  Ele é o responsável por incluir Guards a um endpoint, 
  que nada mais são do que uma forma de restringir o acesso ao recurso. 
  Nesse caso utilizamos a AuthGuard(), que já nos é fornecida pelos pacotes que instalamos anteriormente.
*/

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<{message: string}> {
    await this.authService.signUp(createUserDto);
    return { message: 'Cadastro realizado com sucesso' }
  }

  @Post('/signin')
  async signIn(@Body(ValidationPipe) credentailsDto: CredentialsDTO): Promise<{ token: string }> {
    return await this.authService.signIn(credentailsDto);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getMe(@GetUser() user: User): User {
    return user;
  }
}
