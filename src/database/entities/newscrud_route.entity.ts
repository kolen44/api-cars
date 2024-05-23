import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from './blog.entity';

@Entity()
export class NewsUserCreateEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  telephone_number: string;

  @Column()
  password: string;

  @Column()
  fio: string;

  @Column({ nullable: true })
  tg_id?: string = '';

  @Column({ nullable: true })
  site_url?: string = '';

  @Column({ nullable: true })
  company_name?: string = '';

  @Column({ nullable: true })
  description?: string = '';

  @Column({ nullable: true })
  payments?: string = '';

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true, type: 'bytea' })
  avatar_url?: string;

  @Column({ nullable: true })
  activity?: boolean;

  @Column({ nullable: true })
  role?: string = '';

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  password_updated_at: Date;
}
