import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

/*
  Não seria interessante que apenas administradores pudessem criar outros administradores? 
  Afinal, não queremos que nossos usuários comuns saiam alterando informações sensíveis do sistema.
  Para isso precisamos realizar uma validação de autorização.
  Diferente da autenticação, que é um meio do usuário provar que ele é quem ele diz ser, a autorização é o que define o que um usuário, já autenticado, pode ou não fazer.
  implementar um sistema de autorização,
  seguir a recomendação da própria documentação do NestJS e utilizar Guards.

  Para que isso funcione precisamos colocar essa informação lá antes de realizarmos essa verificação. 
  Vamos criar um decorator para isso, também dentro de auth:
*/

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Extraindo o perfil de usuário (role) de dentro do nosso contexto da requisição
    const userRole = request.user.role;
    const requiredRole = this.reflector.get<string>('role', context.getHandler());

    if(!requiredRole) return true;

    return userRole === requiredRole;
  }
}