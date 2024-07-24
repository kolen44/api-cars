import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ nullable: true })
  url_video?: string;

  @Column({ nullable: true })
  rating?: number;
}
