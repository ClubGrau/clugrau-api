import { EmployeeModel } from '@modules/employees/domain/models/employee.model';
import { BaseController } from '@shared/presentation/protocols/base-controller';
import { HttpResponse } from '@shared/presentation/protocols/http-response';

type HttpErrorBody = { error: string };
type HttpSuccessBody<T> = { data: T };

export class CreateEmployeeController extends BaseController<
  EmployeeModel.CreateEmployeeDto,
  HttpErrorBody | HttpSuccessBody<EmployeeModel.CreateEmployeeResultDto>
> {
  async handle(
    request: EmployeeModel.CreateEmployeeDto,
  ): Promise<
    HttpResponse<
      HttpErrorBody | HttpSuccessBody<EmployeeModel.CreateEmployeeResultDto>
    >
  > {
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];

    const error = this.validationRequiredFields(request, requiredFields);
    if (error) {
      return {
        statusCode: 400,
        body: {
          error: `Missing param ${error}`,
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
