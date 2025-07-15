import { CustomError } from './CustomError';

export class ForbiddenError extends CustomError {
  statusCode = 403;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serialize() {
    return [{ message: this.message }];
  }
}
