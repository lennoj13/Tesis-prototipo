
/**
 * Input reutilizable de MatchPP.
 * Demuestra: React forwardRef, estados de error, composición.
 */

import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, icon, required, helperText, type = 'text', id, className = '', ...rest },
  ref
) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 text-slate-400 text-[1.1rem] flex items-center pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full py-2.5 px-3.5 font-sans text-[0.9375rem] text-slate-800 bg-white border-[1.5px] rounded-lg outline-none transition-all duration-150
            ${icon ? 'pl-[42px]' : ''}
            ${error
              ? 'border-danger focus:ring-3 focus:ring-danger-light'
              : 'border-slate-300 focus:border-primary-500 focus:ring-3 focus:ring-primary-100'
            }
            placeholder:text-slate-400
            disabled:bg-slate-100 disabled:cursor-not-allowed`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="input-error-msg text-[0.8125rem] text-danger flex items-center gap-1" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p className="text-[0.8125rem] text-slate-500">{helperText}</p>
      )}
    </div>
  );
});

export default Input;
