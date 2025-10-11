import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { State } from './state.entity';
import { Country } from './country.entity';

@Entity({ name: 'cities' })
export class City {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'state_id', type: 'bigint' })
  stateId: number;

  @Column({ name: 'state_code', type: 'varchar', length: 255 })
  stateCode: string;

  @Column({ name: 'country_id', type: 'bigint' })
  countryId: number;

  @Column({ name: 'country_code', type: 'char', length: 2 })
  countryCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  timezone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'smallint', default: 1 })
  flag: number;

  @Column({ name: 'wikiDataId', type: 'varchar', length: 255, nullable: true })
  wikiDataId: string;


  @ManyToOne(() => State, state => state.cities)
  @JoinColumn({ name: 'state_id' })
  state: State;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  country: Country;
}
