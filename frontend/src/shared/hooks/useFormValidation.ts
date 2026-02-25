import { useState } from "react";
import { Validator } from "../validators/validators";

export function useFormValidation<T>(
  initialValues: T,
  validators: Record<string, Validator[]>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

}