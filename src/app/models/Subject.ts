import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('subjects')
class Subject {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column()
    name: string;
}

export default Subject;