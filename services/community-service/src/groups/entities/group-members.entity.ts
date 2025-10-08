import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Group } from './groups.entity';
import { User } from '../../users/users.entity';

@Entity({ name: 'group_members' })
@Unique(['groupId', 'userId']) // Ensure a user can only be in a group once
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  groupId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 50, default: 'member' })
  role: string; // 'admin', 'member', etc.

  @CreateDateColumn()
  joinedAt: Date;

  // Relationships
  @ManyToOne(() => Group, group => group.members)
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}

