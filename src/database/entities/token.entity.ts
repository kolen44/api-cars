import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('token_entity')
export class TokenEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column()
  token: string;
}
