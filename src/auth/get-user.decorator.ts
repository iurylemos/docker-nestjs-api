import { createParamDecorator } from '@nestjs/common';
import { User } from '../users/user.entity';

/*
  o decorator nada mais faz do que retornar o objeto do usuário de dentro da requisição. 
  Podemos agora incluí-lo no auth.controller.ts
*/

export const GetUser = createParamDecorator(
  (data, req): User => {
    const user = req.args[0].user;
    return user
  },
)