import type { Request, Response } from "express";
import * as shareServices from "../services/share.services";
import * as tasklistsServices from "../services/tasklists.services";
import { parseId, parseJoinBody, parseShareBody } from "../utils/parse";

/**
 * checkOwner()
 * Looks if the logged user owns the list, if not it sends the error response and returns false.
 *
 * @author Yu Zhang
 * @since 24/11/2026
 * @param listId Number
 * @param res Response
 * @returns Promise<Boolean>
 */
async function checkOwner(listId: number, res: Response): Promise<boolean> {
    const tasklist = await tasklistsServices.getById(listId, res.locals.userId);
    if (!tasklist) {
        res.status(404).json({ error: "Tasklist with this ID doesn't exist" });
        return false;
    }
    if (String(tasklist.userId) !== String(res.locals.userId)) {
        res.status(403).json({ error: "Only the owner can share this tasklist" });
        return false;
    }
    return true;
}

// GET /tasklists/:id/share
export async function getAll(req: Request, res: Response) {
    try {
        // Look if ID is Integer
        const id = parseId(req.params.id);
        if ( id === null ) {
            return res.status(400).json({ error: "Wrong ID type" });
        }

        // Look if it exists
        const tasklist = await tasklistsServices.getById(id, res.locals.userId);
        if (!tasklist) {
            return res.status(404).json({ error: "Tasklist with this ID doesn't exist" });
        }

        // Return
        res.status(200).json(await shareServices.getAll(id));

    } catch (err) {
        console.log(`${err}`);
        res.status(500).json({ error: "Database error" })
    }
}

// PUT /tasklists/:id/share/:userId
export async function update(req: Request, res: Response) {
    try {
        // Look if IDs are Integer
        const id = parseId(req.params.id);
        const userId = parseId(req.params.userId);
        if ( id === null || userId === null ) {
            return res.status(400).json({ error: "Wrong ID type" });
        }

        // Look if body is valid
        const data = parseShareBody(req.body);
        if ( data === null ) {
            return res.status(400).json({ error: "Wrong body type" });
        }

        // Look if the user is the owner
        if (!await checkOwner(id, res)) return;

        // Look if it is shared with this user
        const share = await shareServices.update(id, res.locals.userId, userId, data.permissions);
        if (!share) {
            return res.status(404).json({ error: "Tasklist is not shared with this user" });
        }

        // Return
        res.status(200).json(share);

    } catch (err) {
        console.log(`${err}`);
        res.status(500).json({ error: "Database error" })
    }
}

// DELETE /tasklists/:id/share/:userId
export async function remove(req: Request, res: Response) {
    try {
        // Look if IDs are Integer
        const id = parseId(req.params.id);
        const userId = parseId(req.params.userId);
        if ( id === null || userId === null ) {
            return res.status(400).json({ error: "Wrong ID type" });
        }

        // Look if the user is the owner
        if (!await checkOwner(id, res)) return;

        // Look if it is shared with this user
        const share = await shareServices.remove(id, res.locals.userId, userId);
        if (!share) {
            return res.status(404).json({ error: "Tasklist is not shared with this user" });
        }

        // Return
        res.status(200).json(share);

    } catch (err) {
        console.log(`${err}`);
        res.status(500).json({ error: "Database error" })
    }
}

// POST /tasklists/:id/share
export async function createCode(req: Request, res: Response) {
    try {
        // Look if ID is Integer
        const id = parseId(req.params.id);
        if ( id === null ) {
            return res.status(400).json({ error: "Wrong ID type" });
        }

        // Look if body is valid
        const data = parseShareBody(req.body);
        if ( data === null ) {
            return res.status(400).json({ error: "Wrong body type" });
        }

        // Look if the user is the owner
        if (!await checkOwner(id, res)) return;

        // Return
        res.status(201).json(await shareServices.createCode(id, res.locals.userId, data.permissions));

    } catch (err) {
        console.log(`${err}`);
        res.status(500).json({ error: "Database error" })
    }
}

// POST /tasklists/join
export async function join(req: Request, res: Response) {
    try {
        // Look if body is valid
        const data = parseJoinBody(req.body);
        if ( data === null ) {
            return res.status(400).json({ error: "Wrong body type" });
        }

        // Use the code
        const tasklist = await shareServices.join(data.code, res.locals.userId);
        if (!tasklist) {
            if (await shareServices.isCodeValid(data.code)) {
                return res.status(409).json({ error: "You already have access to this tasklist" });
            }
            return res.status(404).json({ error: "Invalid or expired code" });
        }

        // Return
        res.status(200).json(tasklist);

    } catch (err) {
        console.log(`${err}`);
        res.status(500).json({ error: "Database error" })
    }
}
