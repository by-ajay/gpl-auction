import React from 'react';

interface NSSLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
}

export const NSSLogo: React.FC<NSSLogoProps> = ({ className = 'w-8 h-8', size = 'custom' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    custom: '',
  };

  return (
    <img
      src="/nss-logo.svg"
      alt="National Service Scheme Emblem"
      className={`inline-block object-contain rounded-full shadow-sm shrink-0 select-none ${sizeClasses[size]} ${className}`}
      loading="eager"
    />
  );
};
