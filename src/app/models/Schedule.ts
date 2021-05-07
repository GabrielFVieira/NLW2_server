import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import AppBaseEntity from './AppBaseEntity';
import Classes from './Classes';
import { Exclude, Expose } from 'class-transformer';
import convertMinutesToHour from '../../utils/convertMinutesToHour';

@Entity('schedules')
class Schedule extends AppBaseEntity {
	@PrimaryGeneratedColumn('increment')
	id: string;

	@Column()
	week_day: number;

	@Column({ name: 'from' })
	@Exclude()
	from_raw: number;

	@Column({ name: 'to' })
	@Exclude()
	to_raw: number;

	@ManyToOne(type => Classes, class_id => class_id.schedules)
	@JoinColumn({ name: 'class_id' })
	school_class: Classes;

	@Expose()
	get from() {
		return convertMinutesToHour(this.from_raw);
	}

	@Expose()
	get to() {
		return convertMinutesToHour(this.to_raw);
	}
}

export default Schedule;
