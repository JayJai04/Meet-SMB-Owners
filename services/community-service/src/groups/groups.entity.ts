import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToOne, JoinColumn} from 'typeorm';
import { User } from '../users/user.entity';


@Entity({ name: 'groups' })
  export class Group {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    groupName: string;

    @Column({ type: 'uuid', nullable: false })
    cityId: string;
  
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'adminId' })
    admin: User;
  
    @CreateDateColumn()
    createdAt: Date; }