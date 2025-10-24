import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

const ResetIcon: React.FC<IconProps> = ({ className, size = 18 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6"></path>
        <path d="M2.5 22v-6h6"></path>
        <path d="M2 11.5a10 10 0 0 1 18.8-4.3l-4.3 4.3"></path>
        <path d="M22 12.5a10 10 0 0 1-18.8 4.3l4.3-4.3"></path>
    </svg>
);

export default ResetIcon;
