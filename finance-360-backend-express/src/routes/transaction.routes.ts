import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { validateBody } from '../middleware/validation.middleware';
import { authenticateJWT } from '../middleware/auth.middleware';
import { createTransactionSchema, updateTransactionSchema } from '../validators/transaction.validators';

const router = Router();

router.use(authenticateJWT);

router.post('/', validateBody(createTransactionSchema), TransactionController.create);
router.get('/', TransactionController.list);
router.get('/:id', TransactionController.getById);
router.put('/:id', validateBody(updateTransactionSchema), TransactionController.update);
router.delete('/:id', TransactionController.delete);

export default router;
