// Um DTO é um objeto que será composto pelos dados que serão utilizados entre diferentes
// métodos da aplicação com um objetivo em comum

export class CreateUserDto {
  email: string;
  name: string;
  password: string;
  passwordConfirmation: string;
}