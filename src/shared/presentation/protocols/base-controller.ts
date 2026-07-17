import { HttpResponse } from './http-response';

export abstract class BaseController<Req, Res> {
  abstract handle(request: Req): Promise<HttpResponse<Res>>;

  protected validationRequiredFields(
    request: Req,
    requiredFields: string[],
  ): string | null {
    for (const field of requiredFields) {
      if (!request[field as keyof Req]) {
        return field;
      }
    }
    return null;
  }
}
