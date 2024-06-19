import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('product_entity')
export class CardProduct {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ nullable: true })
  id_writer: number;

  @Index()
  @Column({ nullable: true })
  article: string;

  @Column({ nullable: true })
  in_stock: number;

  @Index()
  @Column({ nullable: true })
  detail_name: string;

  @Column({ nullable: true })
  included_in_unit?: string;

  @Index()
  @Column({ nullable: true })
  brand: string;

  @Index()
  @Column({ nullable: true })
  model: string;

  @Index()
  @Column({ nullable: true })
  version: string;

  @Index()
  @Column({ nullable: true })
  body_type: string;

  @Index()
  @Column({ nullable: true, type: 'integer' })
  year: number;

  @Index()
  @Column({ nullable: true })
  engine: string;

  @Index()
  @Column({ type: 'float', nullable: true })
  volume: number;

  @Index()
  @Column({ nullable: true })
  engine_type: string;

  @Index()
  @Column({ nullable: true })
  gearbox: string;

  @Index() // Добавление индекса для поля original_number
  @Column({ nullable: true })
  original_number: string;

  @Column({ type: 'double precision', nullable: true })
  price: number;

  @Column({ nullable: true })
  for_naked: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  description: string;

  @Index()
  @Column({ nullable: true })
  year_start_production: number;

  @Index()
  @Column({ nullable: true })
  year_end_production: number;

  @Column({ nullable: true })
  url_photo_details: string;

  @Column({ nullable: true })
  url_car_photo: string;

  @Column({ nullable: true })
  video: string;

  @Column({ nullable: true })
  phone: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
