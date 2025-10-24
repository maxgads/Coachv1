import React from 'react';

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-serif font-semibold text-[var(--text-primary)]">{title}</h3>
        {icon}
      </div>
      {children}
    </div>
  );
};

export default StatCard;
