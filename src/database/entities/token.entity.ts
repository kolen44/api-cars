import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TokenEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  token: string;
}
