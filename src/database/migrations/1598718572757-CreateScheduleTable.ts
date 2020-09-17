import { MigrationInterface, QueryRunner, TableForeignKey, Table } from 'typeorm';

export class CreateScheduleTable1598718572757 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'schedules',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment',
					},
					{
						name: 'week_day',
						type: 'int',
					},
					{
						name: 'from',
						type: 'int',
					},
					{
						name: 'to',
						type: 'int',
					},
					{
						name: 'class_id',
						type: 'int',
					},
				],
			})
		);

		await queryRunner.createForeignKey(
			'schedules',
			new TableForeignKey({
				columnNames: ['class_id'],
				referencedTableName: 'classes',
				referencedColumnNames: ['id'],
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('schedules');
	}
}
