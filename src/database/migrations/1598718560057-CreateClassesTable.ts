import { MigrationInterface, QueryRunner, TableForeignKey, Table } from 'typeorm';

export class CreateClassesTable1598718560057 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'classes',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment',
					},
					{
						name: 'cost',
						type: 'decimal',
						scale: 2,
					},
					{
						name: 'description',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'user_id',
						type: 'uuid',
					},
					{
						name: 'subject_id',
						type: 'int',
					},
				],
			})
		);

		await queryRunner.createForeignKey(
			'classes',
			new TableForeignKey({
				columnNames: ['user_id'],
				referencedTableName: 'users',
				referencedColumnNames: ['id'],
			})
		);

		await queryRunner.createForeignKey(
			'classes',
			new TableForeignKey({
				columnNames: ['subject_id'],
				referencedTableName: 'subjects',
				referencedColumnNames: ['id'],
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('classes');
	}
}
