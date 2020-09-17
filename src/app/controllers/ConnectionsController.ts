import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Connection from '../models/Connection';

class ConnectionsController {
	async index(req: Request, res: Response) {
		const repository = getRepository(Connection);
		const total = await repository.count();

		return res.status(200).json({ total });
	}

	async create(req: Request, res: Response) {
		const repository = getRepository(Connection);

		const { class_id } = req.body;
		const user = { id: req.userId };
		const school_class = { id: class_id };

		const connection = repository.create({ user, school_class });
		await repository.save(connection);

		return res.sendStatus(200);
	}
}

export default new ConnectionsController();
