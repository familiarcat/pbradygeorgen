import React from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border-2 border-lime-1000 bg-gradient-to-br from-[#001a1a] to-[#003333] shadow-lg animate-fade-in ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="font-lcars p-5">{children}</div>;
}