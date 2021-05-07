import { Request, Response } from 'express';
import { getRepository, getManager } from 'typeorm';

import Classes from '../models/Classes';
import convertHourToMinutes from '../../utils/convertHourToMinutes';
import Schedule from '../models/Schedule';

class ClassesController {
	async find(req: Request, res: Response) {
		const repository = getRepository(Classes);
		const user = req.userId;

		const classes = await repository.find({
			where: { user },
			relations: ['subject', 'schedules'],
		});

		return res.status(200).json(classes);
	}

	async index(req: Request, res: Response) {
		const repository = getRepository(Classes);
		const { week_day, time, subject } = req.query;

		let subqueryWhereClause = '';
		let convertedTime;

		if (time) {
			subqueryWhereClause = 'sche.from <= :time AND sche.to > :time';
			convertedTime = convertHourToMinutes(time as string);
		}

		if (week_day) {
			subqueryWhereClause +=
				subqueryWhereClause.length > 0 ? ' AND sche.week_day = :week_day' : 'sche.week_day = :week_day';
		}

		let whereClause = subject ? 'sub.id = :subject' : '';

		const subquery = await getManager()
			.createQueryBuilder(Schedule, 'sche')
			.select('"sche".class_id')
			.where(subqueryWhereClause);

		const classes = await repository
			.createQueryBuilder('c')
			.innerJoin('(' + subquery.getQuery() + ')', 'jointable', '"c".id = jointable.class_id')
			.leftJoinAndSelect('c.schedules', 'sche')
			.leftJoinAndSelect('c.subject', 'sub')
			.leftJoinAndSelect('c.user', 'user')
			.where(whereClause, { time: convertedTime, week_day, subject })
			.getMany();

		return res.status(200).json(classes);
	}

	async create(req: Request, res: Response) {
		const repository = getRepository(Classes);

		const user = { id: req.userId };
		const classes = [] as Classes[];
		const insertedClasses = [] as Classes[];

		if (req.body instanceof Array) {
			classes.push(...req.body);
		} else {
			classes.push(req.body);
		}

		const promises = classes.map(async classe => {
			const { id, cost, description, subject, schedules } = classe;

			const classSchedule = schedules.map((scheduleItem: Schedule) => {
				return {
					id: scheduleItem.id,
					week_day: scheduleItem.week_day,
					from_raw: convertHourToMinutes(scheduleItem.from ? scheduleItem.from : '0'),
					to_raw: convertHourToMinutes(scheduleItem.to ? scheduleItem.to : '0'),
				};
			});

			const school_class = repository.create({
				id,
				cost,
				description,
				user,
				subject,
				schedules: classSchedule,
			});
			await repository.save(school_class);

			insertedClasses.push(school_class);
		});

		await Promise.all(promises);

		return res.status(200).json(insertedClasses);
	}

	async delete(req: Request, res: Response) {
		const classesRepository = getRepository(Classes);
		const scheduleRepository = getRepository(Schedule);

		const user = req.userId;
		const { id } = req.headers;

		const classe = await classesRepository.findOne({
			where: { id },
			relations: ['user', 'schedules'],
		});

		if (classe) {
			if (classe.user.id != user) {
				return res.status(401).json({ error: 'This class do not belongs to the current user' });
			}

			if (classe.schedules && classe.schedules.length > 0) {
				classe.schedules.forEach((schedule: Schedule) => {
					scheduleRepository.remove(schedule);
				});
			}

			classesRepository.remove(classe);
			return res.sendStatus(200);
		} else {
			return res.status(404).json({ error: 'Class not found' });
		}
	}
}

export default new ClassesController();
