import { RequestHandler } from 'express';

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



  res.send('hi');
};
