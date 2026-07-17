import { PresentationError } from './presentation.error';

export class MissingParamError extends PresentationError {
  constructor(paramName: string) {
    super(`Missing param ${paramName}`);
  }
}
