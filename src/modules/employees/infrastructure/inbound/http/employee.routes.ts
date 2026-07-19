import { RequestHandler, Router } from 'express';
import { CreateEmployeeController } from '@modules/employees/presentation/controllers/create-employee.controller';
import { adaptRoute } from '@shared/infrastructure/adapters/http/express-route.adapter';

export type EmployeeRoutesDependencies = {
  createEmployeeController: CreateEmployeeController;
  authTokenMiddleware: RequestHandler;
};

export function makeEmployeeRoutes({
  createEmployeeController,
  authTokenMiddleware,
}: EmployeeRoutesDependencies): Router {
  const router = Router();

  router.post('/', authTokenMiddleware, adaptRoute(createEmployeeController));

  return router;
}
