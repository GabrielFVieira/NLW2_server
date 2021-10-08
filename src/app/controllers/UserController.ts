import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';

import User from '../models/User';

class UserController {
	async index(req: Request, res: Response) {
		const repository = getRepository(User);
		const id = req.userId;
		console.log(id);

		const user = await repository.findOne({ where: { id } });

		return res.status(200).json(user);
	}

	async create(req: Request, res: Response) {
		const repository = getRepository(User);
		const { email } = req.body;

		const userExists = await repository.findOne({ where: { email } });

		if (userExists) {
			return res.status(409).json({ error: 'User already exists' });
		}

		const { password: password_raw, name, surname } = req.body;
		const user = repository.create({ email, password_raw, name, surname });
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

		const { name, surname, bio, whatsapp } = req.body;

		const userUpdate = repository.create({
			name,
			surname,
			bio,
			whatsapp,
		});

		if (req.file) {
			const { filename } = req.file;
			userUpdate.avatar_raw = filename;
		}

		await repository.update(id, userUpdate);

		const userBD = await repository.findOne({ where: { id } });
		if (!userBD) {
			return res.status(404).json({ error: 'Error while updating user' });
		}

		return res.status(200).json(userBD);
	}

	async changePassword(req: Request, res: Response) {
		const repository = getRepository(User);
		const id = req.userId;

		const user = await repository.findOne({ where: { id } });

		if (!id || !user) {
			return res.status(404).json({ error: 'User do not exists' });
		}

		const { password, oldPassword } = req.body;

		const isValidPassword = await bcrypt.compare(oldPassword, user.password);

		if (!isValidPassword) {
			return res.status(403).json({ error: 'The old password is invalid' });
		}

		user.password = password;
		user.resetPasswordToken = null;

		await repository.save(user);

		return res.send();
	}

	async resetPassword(req: Request, res: Response) {
		const repository = getRepository(User);
		const id = req.userId;

		const user = await repository.findOne({ where: { id } });

		if (!id || !user) {
			return res.status(404).json({ error: 'User do not exists' });
		}

		const { password } = req.body;
		user.password = password;
		user.resetPasswordToken = null;

		await repository.save(user);

		return res.send();
	}
}

export default new UserController();
