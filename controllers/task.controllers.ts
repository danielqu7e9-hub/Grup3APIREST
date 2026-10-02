import type { Request, Response } from "express";
import * as taskServices from "../services/task.services";
import { parseId, parseTaskUpdateBody, parseTaskCreateBody } from "../utils/parse";

// GET /task
export async function getAll(req: Request, res: Response) {
    try {
        // Look if ID is Integer
        const listId = parseId(req.query.listId);
        if ( listId === null ) {
            return res.status(400).json({ error: "Wrong ID type" });
        }

        let tasks = await taskServices.getAll(listId);

        if (tasks.error) return res.status(400).json(tasks.error);

        res.status(200).json(tasks);

    } catch (err) {
        console.log(`${err}`);
        res.status(500).json({ error: "Database error" })
    }
}

// GET /task by id
export async function getById(req: Request, res: Response) {
    try {
        // Look if ID is Integer
        const id = parseId(req.params.id);
        if ( id === null ) {
            return res.status(400).json({ error: "Wrong ID type" });
        }

        // Look if it exists
        const task = await taskServices.getById(id);
        if (!task) {
            return res.status(404).json({ error: "Task with this ID doesn't exist" });
        }

        // Return
        res.status(200).json(task);

    } catch (err) {
        console.log(`${err}`);
        res.status(500).json({ error: "Database error" })
    }
}

// POST /task
export async function create(req: Request, res: Response) {
    try {
        // Look if body is valid
        const data = parseTaskCreateBody(req.body);
        if ( data === null ) {
            return res.status(400).json({ error: "Wrong body type" });
        }

        // Create it
        const task = await taskServices.create(data);

        // Return
        res.status(201).json({ message: "Created", task: task });

    } catch (err) {
        console.log(`${err}`);
        res.status(500).json({ error: "Database error" })
    }
}

// PUT /task/:id
export async function update(req: Request, res: Response) {
    try {
        // Look if ID is Integer
        const id = parseId(req.params.id);
        if ( id === null ) {
            return res.status(400).json({ error: "Wrong ID type" });
        }

        // Look if body is valid
        const data = parseTaskUpdateBody(req.body);
        if ( data === null ) {
            return res.status(400).json({ error: "Wrong body type" });
        }

        // Look if it exists
        const task = await taskServices.update(id, data);
        if (!task) {
            return res.status(404).json({ error: "Task with this ID doesn't exist" });
        }

        // Return
        res.status(200).json(task);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Database error" })
    }
}

// DELETE /task/:id
export async function remove(req: Request, res: Response) {
    try {
        // Look if ID is Integer
        const id = parseId(req.params.id);
        if ( id === null ) {
            return res.status(400).json({ error: "Wrong ID type" });
        }

        // Look if it exists
        const task = await taskServices.remove(id);
        if (!task) {
            return res.status(404).json({ error: "Task with this ID doesn't exist" });
        }

        // Return
        res.status(200).json(task);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Database error" })
    }
}

