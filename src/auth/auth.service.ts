import { Injectable, UnprocessableEntityException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/users.repository';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user-roles.enum';
import { CredentialsDTO } from '../users/dtos/credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { randomBytes } from 'crypto';
import { ChangePasswordDto } from 'src/users/dtos/change-password.dto';
// Com o UserRepository adicionado ao Módulo
// agora posso criar o método para criação de um usuário comum

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserRepository)
  private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailerService: MailerService
  ) { }

  //Método de cadastro
  async signUp(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password !== createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {

      const user = await this.userRepository.createUser(createUserDto, UserRole.USER);

      const mail = {
        to: user.email,
        from: 'noreply@application.com',
        subject: 'Email de confirmação',
        template: 'email-confirmation',
        context: {
          token: user.confirmationToken,
        }
      }

      await this.mailerService.sendMail(mail)

      return user;
    }
  }

  //Método de Login
  async signIn(credentialsDto: CredentialsDTO) {
    const user = await this.userRepository.checkCredentials(credentialsDto);

    if (user === null) {
      throw new UnauthorizedException('Credenciais inválidas')
    }

    const jwtPayload = {
      id: user.id
    }
    const token = await this.jwtService.sign(jwtPayload);

    return { token }
  }

  /*
    Para que a confirmação de email funcione, 
    precisamos criar um endpoint em nossa API que receba o token enviado por email, 
    encontre o usuário ao qual ele pertence e confirme seu endereço de email.

    Repare que para mostrarmos que o endereço de email do usuário foi confirmado basta mudarmos o valor de “confirmationToken” para null,
    o que indica para nossa aplicação que o usuário validou seu email. 
    Para fazermos isso utilizamos o método update() do repositório. 
    Esse método já vem pronto quando construímos um repositório do TypeORM e recebe dois parâmetros:
    Primeiro parâmetro, o critério para encontrar o registro no banco de dados que deve ser atualizado;
    Segundo parâmetro, um objeto com as alterações que devem ser feitas (no nosso caso, apenas removendo o conformationToken e colocando null no lugar).
  */

  async confirmMail(confirmationToken: string): Promise<void> {
    const result = await this.userRepository.update(
      { confirmationToken },
      { confirmationToken: null }
    );

    if (result.affected === 0) throw new NotFoundException('Token invalido')
  }

  async sendRecoverPasswordEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ email })

    if(!user) {
      throw new NotFoundException("Não há usuário cadastrado com esse email")
    }

    user.recoverToken = randomBytes(32).toString('hex');

    await user.save()

    const mail = {
      to: user.email,
      from: 'noreply@application.com',
      subject: 'Recuperação de senha',
      template: 'recover-password',
      context: {
        token: user.recoverToken,
      },
    };
    await this.mailerService.sendMail(mail);

  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { password, passwordConfirmation } = changePasswordDto;

    if(password !== passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    }

    await this.userRepository.changePassowrd(id, password);
  }

  async resetPassword(recoverToken: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({ recoverToken }, { select: ['id'] });
    if(!user) {
      throw new NotFoundException('Token Inválido')
    }

    try {
      await this.changePassword(user.id.toString(), changePasswordDto);
    } catch (error) {
      throw error;
    }
  }

}
