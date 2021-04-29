import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import bcrypt from 'bcryptjs';
import Classes from './Classes';

@Entity('users')
class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column()
	name: string;

	@Column()
	surname: string;

	@Column()
	bio?: string;

	@Column()
	whatsapp?: string;

	@Column()
	avatar?: string;

	@Column({
		type: 'text',
		unique: true,
		nullable: true,
	})
	resetPasswordToken?: string | null;

	@OneToMany(type => Classes, classes => classes.user, {
		cascade: true,
	})
	classes: Classes[];

	@BeforeInsert()
	private generateHashPassword() {
		if (this.password) {
			this.setPassword(this.password);
		}
	}

	setPassword(password: string) {
		this.password = bcrypt.hashSync(password, 8);
	}

	getCompleteName() {
		return `${this.name} ${this.surname}`;
	}
}

export default User;
