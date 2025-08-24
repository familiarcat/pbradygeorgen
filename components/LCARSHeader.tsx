'use client';
import React from 'react';
import { useLcarsTheme } from '@/context/LcarsThemeContext';

export default function LCARSHeader({ registry = "02-262000", siteName = "TheLCARS.com" }) {
  const { colors } = useLcarsTheme();
  return (
    <header className="bg-lcars-purple text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
      <div className="font-lcars tracking-widest text-lg">{siteName}</div>
      <div className="font-lcars text-sm text-lcars-orange">{registry}</div>
    </header>
  );
}