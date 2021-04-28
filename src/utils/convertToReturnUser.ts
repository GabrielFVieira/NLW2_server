import User from '../app/models/User';

export default function convertToReturnUser(user: User) {
	const { password, resetPasswordToken, ...returnUser } = user;
	return returnUser;
}
