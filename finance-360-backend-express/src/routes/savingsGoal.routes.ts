import { Router } from 'express';
import { SavingsGoalController } from '../controllers/savingsGoal.controller';
import { validateBody } from '../middleware/validation.middleware';
import { authenticateJWT } from '../middleware/auth.middleware';
import { createSavingsGoalSchema, updateSavingsGoalSchema } from '../validators/savingsGoal.validators';

const router = Router();

router.use(authenticateJWT);

router.post('/', validateBody(createSavingsGoalSchema), SavingsGoalController.create);
router.get('/', SavingsGoalController.list);
router.get('/:id', SavingsGoalController.getById);
router.put('/:id', validateBody(updateSavingsGoalSchema), SavingsGoalController.update);
router.delete('/:id', SavingsGoalController.delete);

export default router;
