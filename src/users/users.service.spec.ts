import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRole } from './user-roles.enum';
import { UnprocessableEntityException } from '@nestjs/common';

/*
  MOCKUSEREPOSITORY:
  Ele será responsável por simular todas as chamadas ao userRepository dentro do users.service.ts. 
  Todos os métodos que teremos que emular dentro de nosso arquivo de testes foram especificados
  com o valor jest.fn(). 
  Essa funcionalidade do jest permite emular o funcionamento de métodos externos à classe que estamos testando. 
  Isso é importante para podermos separar os escopos dos nossos testes.
*/

const mockUserRepository = () => ({
  createUser: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  findUsers: jest.fn()
})

/*
  DESCRIBE:
  Utilizamos o describe para separar as partes de nosso teste, 
  sendo que podemos iniciar um describe dentro de outro de forma aninhada. 
  No caso criaremos um describe para cada método do nosso UsersService.
*/

describe('UsersService', () => {
  let userRepository;
  let service;

  /*
    BEFOREEACH:
    É uma função que será executada antes de cada teste a ser realizado. 
    No caso utilizamos ela para inicializar nosso módulo
    e suas dependências que serão utilizadas durante os testes.
  */

  beforeEach(async () => {

    /*
      TestingModule, Test.createTestingModule: 
      Esses recursos são naturais do próprio NestJS para serem utilizados em conjunto com o jest. 
      Eles simulam a inicialização de um módulo e suas dependências.
      É importante aproveitarmos essa parte para inicializarmos o UserRepository que o UsersService 
      precisa para funcionar com nosso mockUserRepository que irá simular as funcionalidades do UserRepository normal.
    */

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useFactory: mockUserRepository
        }
      ]
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
    service = await module.get<UsersService>(UsersService);
  })

  /*
    O iT é utilizado para descrevermos cada teste que será realizado.
    No caso o primeiro teste que realizamos é se o UsersService e o UserRepository foram inicializados com sucesso.
  */

  it('should be defined', () => {
    /*
      É através do expect que verificamos se as coisas aconteceram como esperado. 
      Nesse primeiro teste nós esperávamos que o service e o userRepository fossem inicializados
      com sucesso durante a criação do módulo de teste, por isso esperávamos que seus valores fossem definidos,
      ou seja, diferentes de undefined.
    */
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  })

  describe('createUser', () => {
    let mockCreateUserDto: CreateUserDto;

    beforeEach(() => {
      mockCreateUserDto = {
        email: 'mock@gmail.com',
        name: 'Mock User',
        password: 'mockPassword',
        passwordConfirmation: 'mockPassword'
      }
    })

    it('should create an user if passwords match', async () => {
      userRepository.createUser.mockResolvedValue('mockUser');
      const result = await service.createAdminUser(mockCreateUserDto);

      expect(userRepository.createUser).toHaveBeenCalledWith(
        mockCreateUserDto,
        UserRole.ADMIN
      );

      expect(result).toEqual('mockUser');
    });

    it('should throw an error if passwords doesnt match', async () => {
      mockCreateUserDto.passwordConfirmation = `wrongPassword`;
      expect(service.createAdminUser(mockCreateUserDto)).rejects.toThrow(
        UnprocessableEntityException,
      )
    })

  })
})