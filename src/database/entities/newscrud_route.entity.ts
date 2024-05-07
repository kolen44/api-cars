import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlogEntity } from './blog.entity';

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
  tg_id?: string;

  @Column({ nullable: true })
  site_url?: string;

  @Column({ nullable: true })
  company_name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  payments?: string;

  @Column({ nullable: true })
  avatar_url?: string;

  @Column({ nullable: true })
  activity?: number;

  @OneToMany(() => BlogEntity, (post) => post.user)
  posts: BlogEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
