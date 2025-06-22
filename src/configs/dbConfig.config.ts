import * as path from 'path';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import * as dotenv from 'dotenv';
dotenv.config();

export default (): MysqlConnectionOptions => {
  return {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [path.resolve(__dirname, '..') + '/**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false,
  };
};
