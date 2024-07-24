import { DataSource } from 'typeorm';
import { PostEntity } from './src/database/entities/post.entity';
import { CardProduct } from './src/database/entities/product.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://gen_user:URSn%7Dr%40.fVbz3P@85.234.110.95:5432/default_db',
  entities: [CardProduct, PostEntity],
  migrations: ['dist/src/migration/*.js'],
});
