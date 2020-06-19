import { Router } from 'express';
import { body } from 'express-validator';

import * as policyController from '../controllers/policy';

const router = Router();

router.post(
  '/create',
  [
    body('type').notEmpty().withMessage('Type needs to be passed'),
    body('product').notEmpty().withMessage('Product needs to be passed'),
    body('relationship')
      .notEmpty()
      .withMessage('Relationship needs to be passed'),
    body('startDate').notEmpty().withMessage('Start date needs to be passed'),
    body('endDate').notEmpty().withMessage('End date needs to be passed'),
  ],
  policyController.postCreatePolicy
);

export default router;
