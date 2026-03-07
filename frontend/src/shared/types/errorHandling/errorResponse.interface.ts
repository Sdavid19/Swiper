import { ValidationErrorMessage } from "./validationErrors.type";

export interface ErrorResponse<T> {
  message: ValidationErrorMessage<T> | string;
  statusCode: number;
  error: string;
}