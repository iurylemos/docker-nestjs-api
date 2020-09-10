import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/users.repository';

/* 
  Estratégia para autenticação JWT onde, 
  ao identificarmos um token no cabeçalho da requisição, 
  vamos validá-lo e extrairmos dele o id do usuário que enviou a requisição. 
  Com o id do usuário nós buscamos os dados referentes a ele no banco de dados
   e retornamos essa entidade ao final da validação do token
*/

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'super-secret'
    })
  }

  async validate(payload: { id: number }) {
    const { id } = payload;
    const user = await this.userRepository.findOne(id, {
      select: ['name', 'email', 'status', 'role']
    });

    if(!user) {
      throw new UnauthorizedException('Usuário não encontrado')
    }

    return user;
  }
}