import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

import User from './User';
import Classes from './Classes';

@Entity('connections')
class Connection {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @OneToOne(type => User, user => user.id)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToOne(type => Classes, school_class => school_class.id)
    @JoinColumn({ name: 'class_id' })
    school_class: Classes;
}

export default Connection;