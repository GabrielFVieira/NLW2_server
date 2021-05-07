import { BaseEntity } from 'typeorm';
import { classToPlain } from 'class-transformer';

export default abstract class AppBaseEntity extends BaseEntity {
	toJSON(): {} {
		return classToPlain(this);
	}
}
