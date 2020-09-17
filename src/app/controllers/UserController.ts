import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';

class UserController {
	index(req: Request, res: Response) {
		return res.status(200).send({ userID: req.userId });
	}

	async create(req: Request, res: Response) {
		const repository = getRepository(User);
		const { email } = req.body;

		const userExists = await repository.findOne({ where: { email } });

		if (userExists) {
			return res.status(409).json({ error: 'User already exists' });
		}

		const { password, name, surname } = req.body;

		const user = repository.create({ email, password, name, surname });
		await repository.save(user);

		return res.status(200).json(user);
	}

	async update(req: Request, res: Response) {
		const repository = getRepository(User);
		const id = req.userId;

		const userExists = await repository.findOne({ where: { id } });

		if (!id || !userExists) {
			return res.status(404).json({ error: 'User do not exists' });
		}

		const { name, surname, bio, whatsapp, avatar } = req.body;

		const userUpdate = repository.create({
			name,
			surname,
			bio,
			whatsapp,
			avatar,
		});

		await repository.update(id, userUpdate);

		const userBD = await repository.findOne({ where: { id } });

		return res.status(200).json(userBD);
	}
}

export default new UserController();
