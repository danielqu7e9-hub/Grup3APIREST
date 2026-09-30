import type { Request, Response } from "express";
import * as tasklistsServices from "../services/tasklists.services";

// GET /tasklists
export async function getAll(req: Request, res: Response) {
    let tasklists = await tasklistsServices.getAll();

    if (tasklists.error) return res.status(400).json(tasklists.error);

    res.status(200).json(tasklists);
}

// GET /tasklists by id
export async function getById(req: Request, res: Response) {
    try {
    // Look if ID is Integer
    const id = Number(req.params.id);
    if ( Number.isInteger(id)) return res.status(400).json({ error: "Wrong ID type" });

    // Look if it exists
    const tasklist = await tasklistsServices.getById(id);
    if (!tasklist) return res.status(404).json({ error: "Tasklist with this ID doesn't exist" });

    // Return
    res.status(200).json(tasklist);

    } catch (err) {
        console.log(`${err}`);
        res.status(500).json({ error: "Database error" })
    }
}