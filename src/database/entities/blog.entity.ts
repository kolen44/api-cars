import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NewsUserCreateEntity } from './newscrud_route.entity';

@Entity()
export class BlogEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  avatar_url: string;

  @ManyToOne(() => NewsUserCreateEntity, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'telephone_number' })
  user: NewsUserCreateEntity;

  @Column({ nullable: true })
  title: string;
}
