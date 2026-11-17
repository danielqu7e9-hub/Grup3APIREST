import { Router } from "express";
import * as authControllers from "../controllers/auth.controllers"

const router = Router();

// POST /auth/register
router.post('/register', authControllers.register);

// POST /auth/login
router.post('/login', authControllers.login);

export default router;
