import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';

// O NestJS utiliza Injeção de Dependências para realizar o controle de dependências
// entre diferentes módulos e também mantê-los o mais desacoplado possível
// Proteger o endpoint de criação de usuários administradores
// para que apenas usuários autenticados possam criar novos administradores

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule { }
