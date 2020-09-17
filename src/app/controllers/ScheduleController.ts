import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Schedule from '../models/Schedule';

class ScheduleController {
	async delete(req: Request, res: Response) {
		const repository = getRepository(Schedule);

		const user = req.userId;
		const { id } = req.headers;

		const schedule = await repository
			.createQueryBuilder('schedule')
			.innerJoin('schedule.school_class', 'class', 'class.id = schedule.class_id')
			.where('schedule.id = :id AND class.user_id = :user', { id, user })
			.getOne();

		if (schedule) {
			repository.remove(schedule);
			return res.sendStatus(200);
		} else {
			return res.status(404).json({ error: 'Schedule not found' });
		}
	}
}

export default new ScheduleController();
