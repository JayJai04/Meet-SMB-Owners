import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/users.entity';
import { Group } from '../../groups/entities/groups.entity';

export enum EventType {
  SALE = 'sale',
  GRAND_OPENING = 'grand_opening',
  CLOSURE = 'closure',
  COMMUNITY_EVENT = 'community_event',
  STREET_CLOSURE = 'street_closure',
  CONSTRUCTION = 'construction'
}

@Entity({ name: 'event_announcements' })
export class EventAnnouncement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: EventType})
  eventType: EventType;

  @Column({ type: 'timestamp', nullable: true })
  eventStartDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  eventEndDate: Date | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  location: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number | null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number | null;

  @Column({ type: 'boolean', default: false })
  isUrgent: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // Foreign key columns
  @Column({ type: 'uuid' })
  createdById: string;

  @Column({ type: 'uuid' })
  groupId: string;

  // Relationships
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @ManyToOne(() => Group, { nullable: false })
  @JoinColumn({ name: 'groupId' })
  group: Group;
}

