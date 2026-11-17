import type { Request, Response } from "express";
import * as authServices from "../services/auth.services";
import { parseAuthBody } from "../utils/parse";

// POST /auth/register
export async function register(req: Request, res: Response) {
    try {
        const data = parseAuthBody(req.body);
        if ( data === null ) {
            return res.status(400).json({ error: "Wrong body type" });
        }

        const existing = await authServices.getByUsername(data.username);
        if (existing) {
            return res.status(409).json({ error: "User with this username already exists" });
        }

        const user = await authServices.create(data);

        res.status(201).json(user);

    } catch (err) {
        console.log(`${err}`);
        res.status(500).json({ error: "Database error" })
    }
}

// POST /auth/login
export async function login(req: Request, res: Response) {
    try {
        const data = parseAuthBody(req.body);
        if ( data === null ) {
            return res.status(400).json({ error: "Wrong body type" });
        }

        const user = await authServices.login(data);
        if (!user) {
            return res.status(401).json({ error: "Wrong username or password" });
        }

        res.status(200).json(user);

    } catch (err) {
        console.log(`${err}`);
        res.status(500).json({ error: "Database error" })
    }
}
