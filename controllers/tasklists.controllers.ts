import type { Request, Response } from "express";
import * as tasklistsServices from "../services/tasklists.services";
import { parseId, parseListCreateBody, parseListUpdateBody } from "../utils/parse";

// GET /tasklists
export async function getAll(req: Request, res: Response) {
    try {
        const tasklists = await tasklistsServices.getAll();

        res.status(200).json(tasklists);

    } catch (err) {
        console.log(`${err}`);
        res.status(500).json({ error: "Database error" })
    }
}

// GET /tasklists by id
export async function getById(req: Request, res: Response) {
    try {
        // Look if ID is Integer
        const id = parseId(req.params.id);
        if ( id === null ) {
            return res.status(400).json({ error: "Wrong ID type" });
        }

        // Look if it exists
        const tasklist = await tasklistsServices.getById(id);
        if (!tasklist) {
            return res.status(404).json({ error: "Tasklist with this ID doesn't exist" });
        }

        // Return
        res.status(200).json(tasklist);

    } catch (err) {
        console.log(`${err}`);
        res.status(500).json({ error: "Database error" })
    }
}

// POST /tasklist
export async function create(req: Request, res: Response) {
    try {
        // Look if body is valid
        const data = parseListCreateBody(req.body);
        if ( data === null ) {
            return res.status(400).json({ error: "Wrong body type" });
        }

        // Create it
        const tasklist = await tasklistsServices.create(data);

        // Return
        res.status(201).json(tasklist);

    } catch (err) {
        console.log(`${err}`);
        res.status(500).json({ error: "Database error" })
    }
}

// PUT /tasklists/:id
export async function update(req: Request, res: Response) {
    try {
        // Look if ID is Integer
        const id = parseId(req.params.id);
        if ( id === null ) {
            return res.status(400).json({ error: "Wrong ID type" });
        }

        // Look if body is valid
        const data = parseListUpdateBody(req.body);
        if ( data === null ) {
            return res.status(400).json({ error: "Wrong body type" });
        }

        // Look if it exists
        const tasklist = await tasklistsServices.update(id, data);
        if (!tasklist) {
            return res.status(404).json({ error: "Tasklist with this ID doesn't exist" });
        }

        // Return
        res.status(200).json(tasklist);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Database error" })
    }
}

// DELETE /tasklists/:id
export async function remove(req: Request, res: Response) {
    try {
        // Look if ID is Integer
        const id = parseId(req.params.id);
        if ( id === null ) {
            return res.status(400).json({ error: "Wrong ID type" });
        }

        // Look if it exists
        const tasklist = await tasklistsServices.remove(id);
        if (!tasklist) {
            return res.status(404).json({ error: "Tasklist with this ID doesn't exist" });
        }

        // Return
        res.status(200).json(tasklist);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Database error" })
    }
}

