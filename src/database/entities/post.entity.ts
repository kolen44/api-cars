import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NewsUserCreateEntity } from './newscrud_route.entity';

@Entity('post_entity')
export class PostEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  id_writer: number;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  timestamp: string;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  image_url: string;

  @ManyToOne(() => NewsUserCreateEntity, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: NewsUserCreateEntity;

  @Column({ nullable: true })
  url_video?: string;

  @Column({ nullable: true })
  rating?: number;
}
