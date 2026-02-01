import React from 'react';

// --- Retro Button ---
interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const RetroButton: React.FC<RetroButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  ...props 
}) => {
  const baseStyle = "font-['VT323'] text-xl px-6 py-2 border-2 border-black transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none shadow-nes uppercase tracking-wide";
  
  let variantStyle = "";
  switch (variant) {
    case 'primary':
      variantStyle = "bg-nes-red text-white hover:bg-nes-darkRed";
      break;
    case 'danger':
      variantStyle = "bg-gray-800 text-white hover:bg-black";
      break;
    case 'secondary':
    default:
      variantStyle = "bg-white text-black hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600";
      break;
  }

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Retro Input ---
interface RetroInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const RetroInput: React.FC<RetroInputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      {label && <label className="font-['VT323'] text-xl uppercase dark:text-gray-200">{label}</label>}
      <input 
        className={`font-['VT323'] text-xl p-2 border-2 border-black shadow-nes-sm outline-none focus:bg-yellow-50 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900 ${className}`} 
        {...props} 
      />
    </div>
  );
};

// --- Retro Textarea ---
interface RetroTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const RetroTextarea: React.FC<RetroTextareaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      {label && <label className="font-['VT323'] text-xl uppercase dark:text-gray-200">{label}</label>}
      <textarea 
        className={`font-['VT323'] text-xl p-2 border-2 border-black shadow-nes-sm outline-none focus:bg-yellow-50 min-h-[120px] dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900 ${className}`} 
        {...props} 
      />
    </div>
  );
};

// --- Retro Card ---
export const RetroCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 border-2 border-black shadow-nes p-4 ${className}`}>
      {children}
    </div>
  );
};