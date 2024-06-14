import { DataSource } from 'typeorm';
import { NewsUserCreateEntity } from './src/database/entities/newscrud_route.entity';
import { PostEntity } from './src/database/entities/post.entity';
import { CardProduct } from './src/database/entities/product.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://gen_user:k%3A1ENd(%2C%23~%5C%7Bv%7C@92.255.77.32:5432/default_db',
  entities: [CardProduct, NewsUserCreateEntity, PostEntity],
  migrations: ['dist/src/migration/*.js'],
});
