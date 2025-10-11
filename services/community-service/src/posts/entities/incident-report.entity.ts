import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/users.entity';
import { Group } from '../../groups/entities/groups.entity';

export enum IncidentCategory {
  SHOPLIFTING = 'shoplifting',
  VANDALISM = 'vandalism',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  THEFT = 'theft',
  BREAK_IN = 'break_in',
  ASSAULT = 'assault',
  FRAUD = 'fraud'
}

@Entity({ name: 'incident_reports' })
export class IncidentReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  incidentTimestamp: Date;

  @Column({ type: 'varchar', length: 500 })
  incidentAddress: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ 
    type: 'enum', 
    enum: IncidentCategory
  })
  incidentCategory: IncidentCategory;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'boolean', default: false })
  isResolved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // Foreign key columns
  @Column({ type: 'uuid' })
  reportedById: string;

  @Column({ type: 'uuid' })
  groupId: string;

  // Relationships
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'reportedById' })
  reportedBy: User;

  @ManyToOne(() => Group, { nullable: false })
  @JoinColumn({ name: 'groupId' })
  group: Group;
}

