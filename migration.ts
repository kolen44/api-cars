import { DataSource } from 'typeorm';
import { NewsUserCreateEntity } from './src/database/entities/newscrud_route.entity';
import { PostEntity } from './src/database/entities/post.entity';
import { CardProduct } from './src/database/entities/product.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://gen_user:pipDiReM%3C%2497)%5C@194.187.122.146:5432/default_db',
  entities: [CardProduct, NewsUserCreateEntity, PostEntity],
  migrations: ['dist/src/migration/*.js'],
});
