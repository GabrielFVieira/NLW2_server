console.log('process.env.DATABASE_URL :>> ', process.env.DATABASE_URL);
module.exports = {
	type: 'postgres',
	url: process.env.DATABASE_URL,
	ssl: process.env.PORT ? true : false,
	extra: process.env.PORT ? { ssl: { rejectUnauthorized: false } } : {},
	entities: ['dist/app/models/*.js'],
	migrations: ['dist/database/migrations/*.js'],
	cli: {
		migrationsDir: 'src/database/migrations',
		entitiesDir: 'src/app/models',
	},
};
