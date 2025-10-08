// src/users/user.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({ name: 'users' }) // This decorator marks the class as a database table named 'users'.
  export class User {
    @PrimaryGeneratedColumn('uuid') // This will be our primary key, and it will be a UUID.
    id: string;
  
    @Column({ unique: true }) // A regular column. We make it unique to prevent duplicate emails.
    email: string;
  
    @Column() // This will store the *hashed* password, never the plain text.
    password: string;
  
    @Column({ nullable: true }) // We make this nullable (optional) as per our OpenAPI spec.
    firstName: string;
  
    @CreateDateColumn() // This column will automatically be set to the date/time the user was created.
    createdAt: Date;
  
    @UpdateDateColumn() // This column will automatically be updated every time the user entity is changed.
    updatedAt: Date;
  }