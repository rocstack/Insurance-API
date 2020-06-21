import { RequestHandler } from 'express';

// import { PolicyDocument } from '../models/policy';
import SingleTrip from '../models/single-trip';

type RequestBody = {
  type: string;
  area: string;
  product: string;
  relationship: string;
  startDate: string;
  endDate: string;
  ages: Array<number>;
};

// Create a policy
export const postCreatePolicy: RequestHandler = async (req, res, next) => {
  const {
    type,
    area,
    product,
    relationship,
    startDate,
    endDate,
    ages,
  } = req.body as RequestBody;

  // Build policy
  const policy = new SingleTrip({
    type,
    area,
    product,
    relationship,
    startDate,
    endDate,
  });

  try {
    await policy.generatePolicyNumber();
    // await policy.save();
    res.json(policy);
  } catch (err) {
    next(err);
  }

};
