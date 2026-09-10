import { Router } from 'express';
import { BudgetController } from '../controllers/budget.controller';
import { validateBody } from '../middleware/validation.middleware';
import { authenticateJWT } from '../middleware/auth.middleware';
import { createBudgetSchema, updateBudgetSchema } from '../validators/budget.validators';

const router = Router();

router.use(authenticateJWT);

router.post('/', validateBody(createBudgetSchema), BudgetController.create);
router.get('/', BudgetController.list);
router.get('/:id', BudgetController.getById);
router.put('/:id', validateBody(updateBudgetSchema), BudgetController.update);
router.delete('/:id', BudgetController.delete);

export default router;
