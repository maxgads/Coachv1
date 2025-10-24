
import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

const CircleIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
    </svg>
);

export default CircleIcon;
