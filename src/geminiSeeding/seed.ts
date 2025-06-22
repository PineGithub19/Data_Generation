import { DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import MainSeeder from './main.seeder';
import dbConfig from '../configs/dbConfig.config';

const options: DataSourceOptions & SeederOptions = {
  ...dbConfig(),
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);
dataSource
  .initialize()
  .then(async () => {
    await dataSource.synchronize(true);
    await runSeeders(dataSource);
    process.exit();
  })
  .catch((error) => {
    console.error('Error during data seeding:', error);
    process.exit();
  });
