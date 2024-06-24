import { DataSource } from 'typeorm';
import { NewsUserCreateEntity } from './src/database/entities/newscrud_route.entity';
import { PostEntity } from './src/database/entities/post.entity';
import { CardProduct } from './src/database/entities/product.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://gen_user:%3D%7Cfh1c9wY(%5Ca%5Cb@37.220.80.239:5432/default_db',
  entities: [CardProduct, NewsUserCreateEntity, PostEntity],
  migrations: ['dist/src/migration/*.js'],
});
