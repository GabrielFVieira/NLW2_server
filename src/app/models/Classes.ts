import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import Subject from './Subject';
import Schedule from './Schedule';
import User from './User';

@Entity('classes')
class Classes {
	@PrimaryGeneratedColumn('increment')
	id: string;

	@Column()
	cost: number;

	@Column()
	description?: string;

	@OneToOne(type => Subject, subject => subject.id, {
		cascade: true,
	})
	@JoinColumn({ name: 'subject_id' })
	subject: Subject;

	@OneToMany(type => Schedule, schedule => schedule.school_class, {
		cascade: true,
	})
	schedules: Schedule[];

	@ManyToOne(type => User, user => user.classes)
	@JoinColumn({ name: 'user_id' })
	user: User;
}

export default Classes;
