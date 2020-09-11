import { utilities as nestWinstonModuleUtilities, WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

/*
  No nosso caso, vale observar que criamos dois transports:
  um deles para exibição do log no console e outro para salvar o log em um arquivo.
*/

export const winstonConfig: WinstonModuleOptions = {
  levels: winston.config.npm.levels,
  level: 'verbose',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(), 
        nestWinstonModuleUtilities.format.nestLike())
    }),
    new winston.transports.File({
      level: 'verbose',
      filename: 'application.log',
      dirname: 'logs'
    })
  ]
}