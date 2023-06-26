import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { riskLimitValidationSchema } from 'validationSchema/risk-limits';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.risk_limit
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getRiskLimitById();
    case 'PUT':
      return updateRiskLimitById();
    case 'DELETE':
      return deleteRiskLimitById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRiskLimitById() {
    const data = await prisma.risk_limit.findFirst(convertQueryToPrismaUtil(req.query, 'risk_limit'));
    return res.status(200).json(data);
  }

  async function updateRiskLimitById() {
    await riskLimitValidationSchema.validate(req.body);
    const data = await prisma.risk_limit.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteRiskLimitById() {
    const data = await prisma.risk_limit.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
