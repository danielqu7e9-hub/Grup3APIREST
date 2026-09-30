import { Router } from 'express';
import * as tasklistsControllers from '../controllers/tasklists.controllers'

const router = Router();

// GET /tasklists
router.get('/', tasklistsControllers.getAll);

export default router;