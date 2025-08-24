'use client';
import React from 'react';

export default function LCARSBar({ color = "bg-lcars-lavender", thickness = "h-2", width = "w-full" }) {
  return (
    <div className={`lcars-bar ${color} ${thickness} ${width}`}></div>
  );
}