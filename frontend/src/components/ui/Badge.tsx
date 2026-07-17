import React from 'react';
import './Badge.css';

interface BadgeProps {
  variant?: 'gold' | 'green' | 'red' | 'muted' | 'ink';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'muted',
  size = 'md',
  children,
}) => (
  <span className={`badge badge--${variant} badge--${size}`}>{children}</span>
);
