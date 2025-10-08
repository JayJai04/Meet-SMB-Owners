import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Country } from './country.entity';
import { City } from './city.entity';

@Entity({ name: 'states' })
export class State {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'bigint' })
  countryId: number;

  @Column({ type: 'char', length: 2 })
  countryCode: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fipsCode: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  iso2: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  iso31662: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  type: string;

  @Column({ type: 'int', nullable: true })
  level: number;

  @Column({ type: 'bigint', nullable: true })
  parentId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  native: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
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

  @ManyToOne(() => Country, country => country.states)
  @JoinColumn({ name: 'countryId' })
  country: Country;

  @OneToMany(() => City, city => city.state)
  cities: City[];
}
