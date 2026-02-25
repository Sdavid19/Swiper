import { ValidationErrors } from "./validationErrors.type";

export interface ErrorResponse<T> {
  message: string;
  statusCode: number;
  error?: ValidationErrors<T>;
}