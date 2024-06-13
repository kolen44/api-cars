import { DataSource } from 'typeorm';
import { PostEntity } from './src/database/entities/blog.entity';
import { NewsUserCreateEntity } from './src/database/entities/newscrud_route.entity';
import { CardProduct } from './src/database/entities/product.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://gen_user:vNtiZb%2B%3D%25%2C%23%2B10@147.45.159.22:5432/default_db',
  entities: [CardProduct, NewsUserCreateEntity, PostEntity],
  migrations: ['dist/src/migration/*.js'],
});
