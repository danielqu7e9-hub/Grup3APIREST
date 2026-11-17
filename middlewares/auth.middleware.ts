import type { Request, Response, NextFunction } from "express";
import * as authServices from "../services/auth.services";

/**
 * requireAuth()
 * Middleware that looks for the TOKEN header, checks if it belongs to a user
 * and saves the user id in res.locals.userId, otherwise it returns a 401.
 *
 * @author Daniel Qu
 * @since 17/11/2026
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns Promise<Void>
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.get("TOKEN");
        if (!token) {
            return res.status(401).json({ error: "Missing TOKEN header" });
        }

        const user = await authServices.getByToken(token);
        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }

        res.locals.userId = user.id;
        next();

    } catch (err) {
        console.log(`${err}`);
        res.status(500).json({ error: "Database error" })
    }
}
