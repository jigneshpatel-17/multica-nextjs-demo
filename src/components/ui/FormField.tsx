import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from "react";
import { cn } from "./cn";

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  const generated = useId();
  const id = htmlFor ?? generated;
  const errId = `${id}-err`;
  const hintId = `${id}-hint`;

  let control: ReactNode = children;
  if (isValidElement(children)) {
    const existing = children.props as { id?: string; "aria-describedby"?: string };
    const desc = [hint ? hintId : null, error ? errId : null].filter(Boolean).join(" ") || undefined;
    control = cloneElement(children as ReactElement<Record<string, unknown>>, {
      id: existing.id ?? id,
      "aria-describedby": [existing["aria-describedby"], desc].filter(Boolean).join(" ") || undefined,
    });
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span aria-hidden="true" className="ml-0.5 text-rose-500">*</span>}
      </label>
      {control}
      {hint && !error && (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} className="text-xs text-rose-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
