import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-4">
    <div
      className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-[var(--accent-green)] border-t-transparent"
      style={{ animation: 'spin 1.2s linear infinite' }}
    ></div>
    <p className="font-serif text-[var(--text-secondary)]">Cargando tu plan de estudio...</p>
    <style>
      {`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}
    </style>
  </div>
);

export default LoadingSpinner;
