import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

/*
  O Mailer Module nada mais é do que o nodemailer encapsulado em um módulo do NestJS 
  para facilitar seu uso junto com o framework.
  Ao ler a documentação do Mailer Module vemos que para utilizar o serviço de envio de emails
  precisamos adicioná-lo aos imports do nosso app.module.ts. 
  Entretanto, para inicializar o módulo, ele necessita de diversos parâmetros de configuração
*/

export const mailerConfig: MailerOptions = {
 template: {
   dir: path.resolve(__dirname, '..', '..', 'templates'),
   adapter: new HandlebarsAdapter(),
   options: {
     extName: '.hbs',
     layoutsDir: path.resolve(__dirname, '..', '..', 'templates')
   }
 },
 transport: `smtps://iury0@gmail.com:teste@smtp.gmail.com`
}
