import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import bcrypt from 'bcryptjs';
import ip from 'ip';
import Classes from './Classes';
import { Exclude, Expose } from 'class-transformer';
import AppBaseEntity from './AppBaseEntity';

@Entity('users')
class User extends AppBaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	email: string;

	@Column({ name: 'password' })
	@Exclude()
	password_raw: string;

	@Column()
	name: string;

	@Column()
	surname: string;

	@Column()
	bio?: string;

	@Column()
	whatsapp?: string;

	@Column({ name: 'avatar' })
	@Exclude()
	avatar_raw?: string;

	@Column({
		type: 'text',
		unique: true,
		nullable: true,
	})
	@Exclude()
	resetPasswordToken?: string | null;

	@OneToMany(type => Classes, classes => classes.user, {
		cascade: true,
	})
	classes: Classes[];

	@BeforeInsert()
	private generateHashPassword() {
		if (this.password_raw) {
			this.password = this.password_raw;
		}
	}

	get password() {
		return this.password_raw;
	}

	set password(password: string) {
		this.password_raw = bcrypt.hashSync(password, 8);
	}

	getCompleteName() {
		return `${this.name} ${this.surname}`;
	}

	@Expose()
	get avatar() {
		if (!this.avatar_raw) {
			return undefined;
		}

		return `http://${ip.address()}:3333/files/${this.avatar_raw}`;
	}
}

export default User;
