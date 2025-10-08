import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { State } from './state.entity';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'char', length: 3, nullable: true })
  iso3: string;

  @Column({ type: 'char', length: 3, nullable: true })
  numericCode: string;

  @Column({ type: 'char', length: 2, nullable: true })
  iso2: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phonecode: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  capital: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  currency: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  currencyName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  currencySymbol: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tld: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  native: string;

  @Column({ type: 'bigint', nullable: true })
  population: number;

  @Column({ type: 'bigint', nullable: true })
  gdp: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  region: string;

  @Column({ type: 'bigint', nullable: true })
  regionId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subregion: string;

  @Column({ type: 'bigint', nullable: true })
  subregionId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nationality: string;

  @Column({ type: 'text', nullable: true })
  timezones: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'smallint', default: 1 })
  flag: number;

  @Column({ name: 'wikiDataId', type: 'varchar', length: 255, nullable: true })
  wikiDataId: string;

  // Relationships
  @OneToMany(() => State, state => state.country)
  states: State[];
}
