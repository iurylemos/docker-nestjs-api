import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 32700,
  username: 'pguser',
  password: 'pgpassword',
  database: 'pgnestjs',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};