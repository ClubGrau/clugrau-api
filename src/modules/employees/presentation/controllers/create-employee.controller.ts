import { EmployeeModel } from '@modules/employees/domain/models/employee.model';
import { MissingParamError } from '@shared/presentation/errors/missing-param.error';
import {
  badRequest,
  HttpErrorBody,
} from '@shared/presentation/helpers/http-helper';
import { BaseController } from '@shared/presentation/protocols/base-controller';
import { HttpResponse } from '@shared/presentation/protocols/http-response';

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

    const missingField = this.validationRequiredFields(request, requiredFields);
    if (missingField) {
      return badRequest(new MissingParamError(missingField));
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
