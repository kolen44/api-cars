import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product_entity')
export class CardProduct {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ nullable: true })
  id_writer: number;

  @Column({ nullable: true })
  article: string;

  @Column({ nullable: true })
  in_stock: number;

  @Column({ nullable: true })
  detail_name: string;

  @Column({ nullable: true })
  included_in_unit?: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  version?: string;

  @Column({ nullable: true })
  body_type?: string;

  @Column({ nullable: true, type: 'integer' })
  year?: number;

  @Column({ nullable: true })
  engine: string;

  @Column({ type: 'float', nullable: true })
  volume: number;

  @Column({ nullable: true })
  engine_type?: string;

  @Column({ nullable: true })
  gearbox: string;

  @Column({ nullable: true })
  original_number?: string;

  @Column({ type: 'double precision', nullable: true })
  price: number;

  @Column({ nullable: true })
  for_naked?: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  year_start_production: number;

  @Column({ nullable: true })
  year_end_production: number;

  @Column({ nullable: true })
  url_photo_details: string;

  @Column({ nullable: true })
  url_car_photo?: string;

  @Column({ nullable: true })
  video?: string;

  @Column({ nullable: true })
  phone: string;
}
