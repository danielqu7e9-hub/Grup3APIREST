import { Router } from "express";
import * as tasklistsControllers from "../controllers/tasklists.controllers"

const router = Router();

// GET /tasklists
router.get('/', tasklistsControllers.getAll);

// GET /tasklists/:id
router.get('/:id', tasklistsControllers.getById);

export default router;