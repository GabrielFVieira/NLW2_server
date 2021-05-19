import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Subject from '../models/Subject';

class SubjectController {
	async index(req: Request, res: Response) {
		const repository = getRepository(Subject);
		const subjects = await repository.find({ order: { name: 'ASC' } });

		return res.status(200).json(subjects);
	}

	async create(req: Request, res: Response) {
		const repository = getRepository(Subject);
		const { name } = req.body;

		const subjectExists = await repository.findOne({ where: { name } });

		if (subjectExists) {
			return res.status(409).json({ error: 'Subject already exists' });
		}

		const subject = repository.create({ name });
		await repository.save(subject);

		return res.status(200).json(subject);
	}
}

export default new SubjectController();
