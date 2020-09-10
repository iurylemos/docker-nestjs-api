import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<{message: string}> {
    await this.authService.signUp(createUserDto);
    return { message: 'Cadastro realizado com sucesso' }
  }
}
