import { Router } from "express";
import * as taskControllers from "../controllers/task.controllers"

const router = Router();

// GET /task
router.get('/', taskControllers.getAll);

// GET /task/:id
router.get('/:id', taskControllers.getById);

// POST /task
router.post('/', taskControllers.create);

// PUT /task/:id
router.put('/:id', taskControllers.update);

// DELETE /task/:id
router.delete('/:id', taskControllers.remove);

export default router