export interface Validator {
  name: string;
  validate: (value: string) => boolean;
  message: string;
}

export const requiredValidator: Validator = {
  name: 'required',
  validate: (value: string) => value.trim().length > 0,
  message: 'This field is required',
}

export const minLengthValidator = (min: number): Validator => ({
  name: 'minLength',
  validate: (value: string) => value.length >= min,
  message: `Must be at least ${min} characters`,
})

export const emailValidator: Validator = {
  name: 'email',
  validate: (value: string) => /\S+@\S+\.\S+/.test(value),
  message: 'Invalid email address',
}