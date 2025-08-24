'use client';
import React from 'react';
import Link from 'next/link';

const navItems = ['HOME', 'NEWS', 'MENU', 'COMMS'];

export default function LCARSTopNav() {
  return (
    <nav className="flex space-x-4 bg-lcars-black p-4 rounded-b-lg">
      {navItems.map(item => (
        <Link key={item} href={`/${item.toLowerCase()}`}>
          <a className="bg-lcars-blue text-black rounded px-4 py-2 font-lcars hover:bg-lcars-orange">{item}</a>
        </Link>
      ))}
    </nav>
  );
}