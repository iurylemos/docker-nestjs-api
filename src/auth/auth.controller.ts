import { Controller, Post, Body, ValidationPipe, Get, UseGuards, Patch, Param, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { CredentialsDTO } from '../users/dtos/credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.entity';
import { GetUser } from './get-user.decorator';
import { ChangePasswordDto } from 'src/users/dtos/change-password.dto';
import { UserRole } from '../users/user-roles.enum';

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

  @Patch(':token')
  async confirmMail(@Param('token') token: string) {
    const user = await this.authService.confirmMail(token);
    return {
      message: 'Email confirmado'
    }
  }

  @Post('/send-recover-email')
  async sendRecoverPasswordEmail(@Body('email') email: string): Promise<{message: string}> {
    await this.authService.sendRecoverPasswordEmail(email);

    return {
      message: 'Foi enviado um email com instruções para resetar sua senha'
    }
  }

  @Patch('/reset-password/:token')
  async resetPassword(@Param('token') token: string, @Body(ValidationPipe) changePasswordDto: ChangePasswordDto): Promise<{message: string}> {
    await this.authService.resetPassword(token, changePasswordDto);

    return {
      message: 'Senha alterada com sucesso'
    }
  }

  @Patch(':id/change-password')
  @UseGuards(AuthGuard())
  async changePassword(
    @Param('id') id:string,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
    @GetUser() user: User
  ) {
    if(user.role !== UserRole.ADMIN && user.id.toString() !== id) {
      throw new UnauthorizedException('Você não tem permissão para realizar essa operação')
    }

    await this.authService.changePassword(id, changePasswordDto);
    return {
      message: 'Senha alterada'
    }
  }
}
