import React from 'react';
import './Spinner.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  center?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', center = false }) => (
  <div className={`spinner-wrap ${center ? 'spinner-wrap--center' : ''}`}>
    <div className={`spinner spinner--${size}`} />
  </div>
);
