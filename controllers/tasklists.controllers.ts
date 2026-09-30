import type { Request, Response } from 'express';
import * as tasklistsServices from '../services/tasklists.services';

// GET /tasklists
export async function getAll(_req: Request, res: Response) {
    let tasklists = await tasklistsServices.getAll();

    if (tasklists.error) return res.status(400).json(tasklists.error);

    res.status(200).json(tasklists);
}