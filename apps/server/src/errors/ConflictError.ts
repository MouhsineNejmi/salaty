import { CustomError } from './CustomError';

export class ConflictError extends CustomError {
  statusCode = 409;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  serialize() {
    return [{ message: this.message }];
  }
}
