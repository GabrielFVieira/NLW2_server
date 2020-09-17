import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import Classes from './Classes';

@Entity('schedules')
class Schedule {
	@PrimaryGeneratedColumn('increment')
	id: string;

	@Column()
	week_day: number;

	@Column()
	from: number;

	@Column()
	to: number;

	@ManyToOne(type => Classes, class_id => class_id.schedules)
	@JoinColumn({ name: 'class_id' })
	school_class: Classes;

	from_formated?: string;
	to_formated?: string;
}

export default Schedule;
