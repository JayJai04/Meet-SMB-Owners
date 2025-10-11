import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToOne, JoinColumn, OneToMany} from 'typeorm';
import { User } from '../../users/users.entity';
import { GroupMember } from './group-members.entity';


@Entity({ name: 'groups' })
  export class Group {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    groupName: string;

    @Column({ type: 'bigint', nullable: false })
    cityId: number;

    @Column({ type: 'uuid', nullable: false })
    adminId: string;
  
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'adminId' })
    admin: User;
  
    @CreateDateColumn()
    createdAt: Date;

    // Relationships
    @OneToMany(() => GroupMember, member => member.group)
    members: GroupMember[];
}