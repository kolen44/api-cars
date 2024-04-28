import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class CardProduct {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  article: string

  @Column()
  in_stock: number

  @Column()
  detail_name: string

  @Column({ nullable: true })
  included_in_unit?: string

  @Column()
  brand: string

  @Column()
  model: string

  @Column()
  version: number

  @Column()
  body_type: string

  @Column()
  year: number

  @Column()
  engine: string

  @Column()
  volume: string

  @Column({ nullable: true })
  engine_type?: string

  @Column()
  gearbox: string

  @Column({ nullable: true })
  original_number?: string

  @Column()
  price: number

  @Column({ nullable: true })
  for_naked?: string

  @Column()
  currency: string

  @Column()
  discount: number

  @Column()
  description: string

  @Column()
  year_start_production: number

  @Column()
  year_end_production: number

  @Column()
  url_photo_details: string

  @Column()
  url_car_photo: string

  @Column({ nullable: true })
  video?: string

  @Column()
  phone: string

  @Column()
  vin: string
}
