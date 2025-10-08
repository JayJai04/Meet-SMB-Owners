import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { State } from './state.entity';
import { Country } from './country.entity';

@Entity({ name: 'cities' })
export class City {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'bigint' })
  stateId: number;

  @Column({ type: 'varchar', length: 255 })
  stateCode: string;

  @Column({ type: 'bigint' })
  countryId: number;

  @Column({ type: 'char', length: 2 })
  countryCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  timezone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'smallint', default: 1 })
  flag: number;

  @Column({ name: 'wikiDataId', type: 'varchar', length: 255, nullable: true })
  wikiDataId: string;


  @ManyToOne(() => State, state => state.cities)
  @JoinColumn({ name: 'stateId' })
  state: State;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'countryId' })
  country: Country;
}
