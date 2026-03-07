export type ValidationErrorMessage<T> = {
  [K in keyof T]?: string[];
};