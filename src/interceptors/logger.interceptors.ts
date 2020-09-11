import {
  Injectable,
  Inject,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { Logger } from 'winston';
import { Observable } from 'rxjs';

/*
  Nós armazenamos 6 coisas da requisição: 
  > A data e hora que ela foi realizada, o método ou verbo HTTP utilizado, 
  > O endpoint que foi acessado, o conteúdo da requisição, o endereço de IP de origem da requisição
  > O email do usuário que realizou a requisição
*/

/*
  Eliminamos do corpo da requisição os parâmetros com nome password e passwordConfirmation
  que são os parâmetros com as senhas do usuário.
  Isso garante que nós não salvamos nos nossos logs informações tão sensíveis. 
  Repare também que nós criamos uma cópia do corpo da requisição antes de remover esses dados, 
  pois se fossem removidos direto do corpo da requisição os mesmos não seriam acessíveis posteriormente
  quando estivéssemos tratando nossa requisição
*/

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(@Inject('winston') private logger: Logger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.log(context.switchToHttp().getRequest());
    return next.handle();
  }

  private log(req) {
    const body = { ...req.body };
    delete body.password;
    delete body.passwordConfirmation;
    const user = (req as any).user;
    const userEmail = user ? user.email : null;
    const loggerInfo = {
      timestamp: new Date().toISOString(),
      method: req.method,
      route: req.route.path,
      data: {
        body: body,
        query: req.query,
        params: req.params,
      },
      from: req.ip,
      madeBy: userEmail,
    }
    this.logger.info({...loggerInfo});
  }
}