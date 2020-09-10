import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../users/users.repository';
import { JwtModule } from '@nestjs/jwt';
// Adicionar ao módulo o repositório de usuários
// Por que preciso do método de criação de usuários

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]),
    JwtModule.register({
      secret: 'super-secret',
      signOptions: {
        expiresIn: 18000
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
