import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import AppBaseEntity from './AppBaseEntity';

@Entity('subjects')
class Subject extends AppBaseEntity {
	@PrimaryGeneratedColumn('increment')
	id: string;

	@Column()
	name: string;
}

export default Subject;
