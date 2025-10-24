
import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

const CheckCircleIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="currentColor" stroke="none"></path>
        <path d="m9 12 2 2 4-4" stroke="#222222" strokeWidth="2.5" fill="none"></path>
    </svg>
);

export default CheckCircleIcon;