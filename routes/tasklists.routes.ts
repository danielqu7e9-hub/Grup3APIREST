import { Router } from "express";
import * as tasklistsControllers from "../controllers/tasklists.controllers"

const router = Router();

// GET /tasklists
router.get('/', tasklistsControllers.getAll);

// GET /tasklists/:id
router.get('/:id', tasklistsControllers.getById);

// POST /tasklists
router.post('/', tasklistsControllers.create);

// PUT /tasklists/:id
router.put('/:id', tasklistsControllers.update);

// DELETE /tasklists/:id
router.delete('/:id', tasklistsControllers.remove);

export default router;