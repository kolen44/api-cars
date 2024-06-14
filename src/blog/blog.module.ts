import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsUserCreateEntity } from 'src/database/entities/newscrud_route.entity';
import { PostEntity } from 'src/database/entities/post.entity';
import { NewscrudRoutesModule } from 'src/newscrud_routes/newscrud_routes.module';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, NewsUserCreateEntity]),
    NewscrudRoutesModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
