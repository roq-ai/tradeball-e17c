import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { exchangeValidationSchema } from 'validationSchema/exchanges';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getExchanges();
    case 'POST':
      return createExchange();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getExchanges() {
    const data = await prisma.exchange
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'exchange'));
    return res.status(200).json(data);
  }

  async function createExchange() {
    await exchangeValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.report?.length > 0) {
      const create_report = body.report;
      body.report = {
        create: create_report,
      };
    } else {
      delete body.report;
    }
    if (body?.risk_limit?.length > 0) {
      const create_risk_limit = body.risk_limit;
      body.risk_limit = {
        create: create_risk_limit,
      };
    } else {
      delete body.risk_limit;
    }
    if (body?.stock?.length > 0) {
      const create_stock = body.stock;
      body.stock = {
        create: create_stock,
      };
    } else {
      delete body.stock;
    }
    const data = await prisma.exchange.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
