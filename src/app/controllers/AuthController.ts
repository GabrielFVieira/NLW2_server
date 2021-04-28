import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { resolve } from 'path';

import SendMailService from '../services/SendMailService';
import User from '../models/User';
import convertToReturnUser from '../../utils/convertToReturnUser';

class AuthController {
	async authenticate(req: Request, res: Response) {
		const repository = getRepository(User);
		const { email, password } = req.body;

		const user = await repository.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ error: 'User does not exists' });
		}

		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) {
			return res.status(401).json({ error: 'Invalid password' });
		}

		const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1d' });

		return res.status(200).json({
			user: convertToReturnUser(user),
			token,
		});
	}

	async recovery(req: Request, res: Response) {
		const repository = getRepository(User);
		const { email, recoveryPage } = req.body;

		const user = await repository.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ error: 'User does not exists' });
		}

		const token = jwt.sign({ email }, 'secret', { expiresIn: '15m' });
		user.resetPasswordToken = token;
		repository.save(user);

		const mailPath = resolve(__dirname, '..', 'views', 'emails', 'passwordRecoveryMail.hbs');

		const variables = {
			name: user.getCompleteName(),
			link: `${recoveryPage}/${token}`,
			time: '15 minutos',
		};

		await SendMailService.execute(email, 'Recuperação de senha', variables, mailPath);

		return res.send();
	}
}

export default new AuthController();
