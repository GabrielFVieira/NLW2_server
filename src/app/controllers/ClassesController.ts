import { Request, Response } from 'express';
import { getRepository, getManager } from 'typeorm';

import Classes from '../models/Classes';
import convertHourToMinute from '../../utils/convertHourToMinutes';
import Schedule from '../models/Schedule';

interface ScheduleItem {
    id?: string,
    week_day: string,
    from: string,
    to: string
}

class ClassesController {
    async find(req: Request, res: Response) {
        const repository = getRepository(Classes);
        const user = req.userId;
        
        const classes = await repository.findOne({ where: { user }, relations: ["subject","schedules"] })

        return res.status(200).json(classes);
    }
    
    async index(req: Request, res: Response) {
        const repository = getRepository(Classes);
        const { week_day, time, subject } = req.query;

        let subqueryWhereClause = "";
        let convertedTime;

        if(time) {
            subqueryWhereClause = "sche.from <= :time AND sche.to > :time";
            convertedTime = convertHourToMinute(time as string);
        }

        if(week_day) { 
            subqueryWhereClause += subqueryWhereClause.length > 0 ? " AND sche.week_day = :week_day" : "sche.week_day = :week_day"
        }

        let whereClause = subject ? "sub.id = :subject" : "";
        
        const subquery = await getManager()
        .createQueryBuilder(Schedule, 'sche')
        .select('"sche".class_id')
        .where(subqueryWhereClause)
        
        const classes = await repository.createQueryBuilder("c")
        .innerJoin('('+subquery.getQuery()+')', 'jointable', '"c".id = jointable.class_id')
        .leftJoinAndSelect("c.schedules", "sche")
        .leftJoinAndSelect("c.subject", "sub")
        .leftJoinAndSelect("c.user", "user")
        .where(whereClause, { time:convertedTime, week_day, subject })
        .getMany()

        return res.status(200).json(classes);
    }

    async create(req: Request, res: Response) {
        const repository = getRepository(Classes);
    
        const { id, cost, description, subject, schedules } = req.body;
        const user = { id: req.userId };

        const classSchedule = schedules.map((scheduleItem: ScheduleItem) => {
            return {
                id: scheduleItem.id,
                week_day: scheduleItem.week_day,
                from: convertHourToMinute(scheduleItem.from),
                to: convertHourToMinute(scheduleItem.to),
            };
        })

        const school_class = repository.create({ id, cost, description, user, subject, schedules:classSchedule });
        await repository.save(school_class);

        return res.status(200).json(school_class);
    }
}

export default new ClassesController();