/* eslint-disable max-classes-per-file */

import { ApplicationErrorResponse } from './application-error-response';

export class ApplicationError extends Error {
  code: number;

  headers?: Record<string, string | number>;

  constructor(code: number, message: string, headers?: Record<string, string | number>) {
    super(message);
    this.code = code;
    this.headers = headers;
  }

  toResponse(): ApplicationErrorResponse {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

export class BadRequestError extends ApplicationError {
  constructor() {
    super(400, 'Bad Request');
  }
}

export class UnauthorisedError extends ApplicationError {
  constructor() {
    super(401, 'Unauthorised');
  }
}

export class ForbiddenError extends ApplicationError {
  constructor() {
    super(403, 'Forbidden');
  }
}

export class TestCentreNotFoundError extends ApplicationError {
  constructor() {
    super(404, 'Test centre with given id not found');
  }
}

export class ReservationNotValidError extends ApplicationError {
  constructor() {
    super(404, 'Reservation no longer valid');
  }
}

export class ReservationConflictError extends ApplicationError {
  constructor() {
    super(409, 'Conflict - slot no longer available');
  }
}

export class TooManyRequestsError extends ApplicationError {
  constructor() {
    super(429, 'Too Many Requests', {
      'Retry-After': 3600,
    });
  }
}

export class InternalServerError extends ApplicationError {
  constructor() {
    super(500, 'Internal Server Error');
  }
}

export class ServiceUnavailableError extends ApplicationError {
  constructor() {
    super(503, 'Service Unavailable');
  }
}
