/* eslint-disable no-unused-vars */
import { ValidationError } from 'class-validator';

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSED = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export default class CustomError extends Error {
  public code: number;

  public message: string;

  public errors: ValidationError[] | undefined;

  constructor(message: string, code: number, errors?: ValidationError[]) {
    super(message);
    this.message = message;
    this.code = code;
    this.errors = errors;
  }

  static badRequest(message: string, errors?: ValidationError[]) {
    return new CustomError(message, HttpStatusCode.BAD_REQUEST, errors);
  }

  static unprocessed(message: string) {
    return new CustomError(message, HttpStatusCode.UNPROCESSED);
  }

  static notFound(message: string) {
    return new CustomError(message, HttpStatusCode.NOT_FOUND);
  }

  static unauthorized(message: string) {
    return new CustomError(message, HttpStatusCode.UNAUTHORIZED);
  }

  static internalServerError(message: string) {
    return new CustomError(message, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }

  static forbidden() {
    return new CustomError('Forbidden', HttpStatusCode.FORBIDDEN);
  }
}
