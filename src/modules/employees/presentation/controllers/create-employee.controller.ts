import { EmployeeModel } from '@modules/employees/domain/models/employee.model';

interface HttpResponse<T> {
  statusCode: number;
  body: T;
}

type HttpErrorBody = { error: string };
type HttpSuccessBody<T> = { data: T };

export class CreateEmployeeController {
  handle(
    request: EmployeeModel.CreateEmployeeDto,
  ): HttpResponse<
    HttpErrorBody | HttpSuccessBody<EmployeeModel.CreateEmployeeResultDto>
  > {
    if (!request.name) {
      return {
        statusCode: 400,
        body: {
          error: 'Missing param name',
        },
      };
    }

    if (!request.email) {
      return {
        statusCode: 400,
        body: {
          error: 'Missing param email',
        },
      };
    }

    if (!request.password) {
      return {
        statusCode: 400,
        body: {
          error: 'Missing param password',
        },
      };
    }

    if (!request.passwordConfirmation) {
      return {
        statusCode: 400,
        body: {
          error: 'Missing param passwordConfirmation',
        },
      };
    }
    // TODO: call CreateEmployeeUsecase and return { data: result }
    return {
      statusCode: 200,
      body: {
        data: { id: '' },
      },
    };
  }
}
