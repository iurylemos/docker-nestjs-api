import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRole } from './user-roles.enum';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CredentialsDTO } from './dtos/credentials.dto';
import { FindUsersQueryDto } from './dtos/find-users-query.dto';

// Acesso ao banco de dados
// Recebemos como parâmetro no método a função do usuário na forma de nosso RolesEnum,
// fazendo com que ela possa posteriormente ser reutilizado na criação de um usuário comum

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto, role: UserRole): Promise<User> {
    const { email, name, password } = createUserDto;

    const user = this.create();
    user.email = email;
    user.name = name;
    user.role = role;
    user.status = true;
    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
      delete user.password;
      delete user.salt;
      return user;
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException('Endereço de e-mail já está em uso!')
      } else {
        throw new InternalServerErrorException('Error ao salvar o usuário no banco de dados')
      }
    }
  }

  // Método para verificação das credenciais de um usuário
  async checkCredentials(credentialsDto: CredentialsDTO): Promise<User> {
    const { email, password } = credentialsDto;
    const user = await this.findOne({ email, status: true });

    if (user && (await user.checkPassword(password))) {
      return user;
    } else {
      return null;
    }
  }

  async findUsers(queryDto: FindUsersQueryDto): Promise<{ users: User[]; total: number }> {
    queryDto.status = queryDto.status === undefined ? true : queryDto.status;
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;

    const { email, name, status, role } = queryDto;
    // Função createQueryBuilder passamos como argumento a string ‘user’. 
    // Essa string será o alias utilizado durante a montagem da query.
    const query = this.createQueryBuilder('user');

    /*
      Após chamarmos query.where() pela primeira vez nós passamos a chamar o método query.andWhere().
      Fazemos isso pois se chamarmos o método query.where() novamente ele irá substituir 
      toda nossa query ao invés de adicionar uma nova condição
    */
    query.where('user.status = :status', { status });

    if (email) {
      query.andWhere('user.email ILIKE :email', { email: `%${email}%` });
    }

    if (name) {
      query.andWhere('user.name ILIKE :name', { name: `%${name}%` });
    }

    if(role) {
      query.andWhere('user.role = :role', { role });
    }

    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select(['user.name', 'user.email', 'user.role', 'user.status']);

    /*
      Para executarmos a query nós chamamos o método query.getManyAndCount(). 
      Esse método nos retorna dois valores: o primeiro são os usuários encontrados, 
      o segundo o total de dados que satisfazem as condições especificadas, ignorando a paginação. 
      Isso é muito útil para que nosso client possa exibir os dados utilizando a paginação do servidor.
    */

    const [users, total] = await query.getManyAndCount();

    return { users, total };
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}