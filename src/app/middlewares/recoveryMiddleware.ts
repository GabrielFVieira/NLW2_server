import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import User from '../models/User';

interface TokenPayload {
	email: string;
	iat: number;
	exp: number;
}

export default async function recoveryMiddleware(req: Request, res: Response, next: NextFunction) {
	const { authorization } = req.headers;

	if (!authorization) {
		return res.status(401).json({ error: 'Invalid credentials' });
	}

	const token = authorization.replace('Bearer', '').trim();

	try {
		const data = jwt.verify(token, 'secret');

		const { email } = data as TokenPayload;
		const repository = getRepository(User);

		const user = await repository.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ error: 'User do not exists' });
		}

		if (user.resetPasswordToken != token) {
			return res.status(401).json({ error: 'The given token is invalid' });
		}

		req.userId = user.id;

		return next();
	} catch {
		return res.status(401).json({ error: 'Access not authorized' });
	}
}
