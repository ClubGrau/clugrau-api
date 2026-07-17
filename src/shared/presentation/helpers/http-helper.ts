import { HttpResponse } from '../protocols/http-response';

export type HttpErrorBody = { error: string };

export const badRequest = (error: Error): HttpResponse<HttpErrorBody> => ({
  statusCode: 400,
  body: {
    error: error.message,
  },
});
