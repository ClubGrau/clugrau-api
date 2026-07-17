import { HttpResponse } from '../protocols/http-response';

export type HttpErrorBody = { error: string };
export type HttpSuccessBody<T> = { data: T };

export const badRequest = (error: Error): HttpResponse<HttpErrorBody> => ({
  statusCode: 400,
  body: {
    error: error.message,
  },
});

export const created = <T>(data: T): HttpResponse<HttpSuccessBody<T>> => ({
  statusCode: 201,
  body: {
    data,
  },
});

export const serverError = (error: Error): HttpResponse<HttpErrorBody> => ({
  statusCode: 500,
  body: {
    error: error.message,
  },
});
