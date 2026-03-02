export type FieldError = {
  field: string;
  message: string;
};

export type Validator = (value: string, field: string) => FieldError | null;

export const required: Validator = (value, field) => {
  return value.trim() === "" ? { field, message: "This field is required" } : null;
};

export const minLength = (min: number): Validator => (value, field) => {
  return value.length < min ? { field, message: `Must be at least ${min} characters` } : null;
};

export const email: Validator = (value, field) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !regex.test(value) ? { field, message: "Invalid email format" } : null;
};