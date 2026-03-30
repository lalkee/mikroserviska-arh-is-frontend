import React from 'react';

interface BaseCardProps {
  id?: number | string;
  onEdit?: (id: string) => void;
  className?: string;
  children: React.ReactNode;
}

const BaseCard: React.FC<BaseCardProps> = ({ id, onEdit, className = "", children }) => (
  <div className={`card group relative ${className}`}>
    {onEdit && id !== undefined && (
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onEdit(String(id));
        }}
        className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black opacity-0 group-hover:opacity-100 transition-all z-10"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
    )}
    {children}
  </div>
);

export default BaseCard;
