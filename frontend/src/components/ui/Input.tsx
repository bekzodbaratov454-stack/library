import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`}>
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="field__wrap">
        {leftIcon && <span className="field__icon field__icon--left">{leftIcon}</span>}
        <input
          id={inputId}
          className={`field__input ${leftIcon ? 'field__input--pl' : ''} ${rightIcon ? 'field__input--pr' : ''}`}
          {...props}
        />
        {rightIcon && <span className="field__icon field__icon--right">{rightIcon}</span>}
      </div>
      {error && <p className="field__error">{error}</p>}
      {!error && hint && <p className="field__hint">{hint}</p>}
    </div>
  );
};
