// DTO para representar os possíveis filtros da nossa aplicação

//Nesse arquivo declaramos uma classe abstrata com alguns parâmetros que serão comuns 
// a todas requisições de busca com filtros

/*
  SORT:
  
  Reponsável por passar a string representando um objeto javascript com informações
  a respeito de como os dados devem ser ordenados ao serem buscados no banco de dados. 
  Como estamos passando esse parâmetro como um Query Parameter na URL, 
  é interessante o client utilizar o JSON.stringify() para converter o objeto em string. 
  Por exemplo:

  // exemplo de um objeto com as informações de ordenação
  const sort = {
    name: "ASC",
    email: "DESC"
  }

  const sortString = JSON.stringify(sort)
  // sortString => "{\"name\":\"ASC\",\"email\":\"DESC\"}"
*/

/*
  PAGE:

  Para dar suporte à paginação, 
  informa qual a página dos resultados está sendo consultada pelo client
  (será utilizada para definirmos quantos dados devemos pular ao consultar o banco de dados)
*/

// LIMIT: Quantidade de dados a serem retornados por página

export abstract class BaseQueryParametersDto {
  sort: string;
  page: number;
  limit: number;
}