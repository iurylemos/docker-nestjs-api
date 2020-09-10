import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

// O NestJS utiliza Injeção de Dependências para realizar o controle de dependências
// entre diferentes módulos e também mantê-los o mais desacoplado possível

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
