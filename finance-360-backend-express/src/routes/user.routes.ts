import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateBody } from '../middleware/validation.middleware';
import { authenticateJWT } from '../middleware/auth.middleware';
import { updateUserSchema } from '../validators/user.validators';

const router = Router();

router.put('/:id', authenticateJWT, validateBody(updateUserSchema), UserController.updateUser);

export default router;
