import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { stockValidationSchema } from 'validationSchema/stocks';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getStocks();
    case 'POST':
      return createStock();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getStocks() {
    const data = await prisma.stock
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'stock'));
    return res.status(200).json(data);
  }

  async function createStock() {
    await stockValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.trade?.length > 0) {
      const create_trade = body.trade;
      body.trade = {
        create: create_trade,
      };
    } else {
      delete body.trade;
    }
    const data = await prisma.stock.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
