import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateConnectionsTable1598731598235 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'connections',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment',
					},
					{
						name: 'user_id',
						type: 'uuid',
					},
					{
						name: 'class_id',
						type: 'int',
					},
				],
			})
		);

		await queryRunner.createForeignKey(
			'connections',
			new TableForeignKey({
				columnNames: ['user_id'],
				referencedTableName: 'users',
				referencedColumnNames: ['id'],
			})
		);

		await queryRunner.createForeignKey(
			'connections',
			new TableForeignKey({
				columnNames: ['class_id'],
				referencedTableName: 'classes',
				referencedColumnNames: ['id'],
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('connections');
	}
}
