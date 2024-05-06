import { Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
