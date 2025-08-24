'use client';
import React from 'react';

const categories = ['LICENSE', 'DOWNLOAD', 'THEMES', 'COLORS', 'FONTS', 'HTML ELEMENTS', 'USING IMAGES', 'BUTTONS'];

export default function LCARSCategoryGroup() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-lcars-black">
      {categories.map(cat => (
        <div key={cat} className="rounded-full px-4 py-2 text-center font-lcars bg-lcars-mars text-white">
          {cat}
        </div>
      ))}
    </div>
  );
}