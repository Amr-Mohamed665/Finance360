import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { validateBody } from '../middleware/validation.middleware';
import { authenticateJWT } from '../middleware/auth.middleware';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validators';

const router = Router();

router.use(authenticateJWT);

router.post('/', validateBody(createCategorySchema), CategoryController.create);
router.get('/', CategoryController.list);
router.get('/:id', CategoryController.getById);
router.put('/:id', validateBody(updateCategorySchema), CategoryController.update);
router.delete('/:id', CategoryController.delete);

export default router;
