import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`bg-lime-600 hover:bg-lime-400 transition-colors duration-300 ease-in-out text-black font-bold py-2 px-6 rounded-full shadow-md animate-pulse-slow ${className}`}
    >
      {children}
    </button>
  );
}
