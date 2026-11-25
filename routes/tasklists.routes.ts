import { Router } from "express";
import * as tasklistsControllers from "../controllers/tasklists.controllers"
import * as shareControllers from "../controllers/share.controllers"

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

// GET /tasklists/:id/share
router.get('/:id/share', shareControllers.getAll);

// POST /tasklists/:id/share
router.post('/:id/share', shareControllers.createCode);

// POST /tasklists/join
router.post('/join', shareControllers.join);

// PUT /tasklists/:id/share/:userId
router.put('/:id/share/:userId', shareControllers.update);

// DELETE /tasklists/:id/share/:userId
router.delete('/:id/share/:userId', shareControllers.remove);

export default router;