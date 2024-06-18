import { DataSource } from 'typeorm';
import { NewsUserCreateEntity } from './src/database/entities/newscrud_route.entity';
import { PostEntity } from './src/database/entities/post.entity';
import { CardProduct } from './src/database/entities/product.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://gen_user:%5C%3A%40%5CE%7DEXMeC9Xj@92.53.119.194:5432/default_db',
  entities: [CardProduct, NewsUserCreateEntity, PostEntity],
  migrations: ['dist/src/migration/*.js'],
});
