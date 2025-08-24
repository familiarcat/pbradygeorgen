import { lcarsTokens } from "@/tokens/lcars-token-map";
'use client';
import Link from 'next/link';

export default function LcarsNavRail() {
  return (
    <nav className='lcars-nav'>
      <ul>
        <li><Link href='/'>Dashboard</Link></li>
        <li><Link href='/grooming'>Grooming</Link></li>
        <li><Link href='/planning'>Planning</Link></li>
        <li><Link href='/active'>Active Sprint</Link></li>
        <li><Link href='/retro'>Retro</Link></li>
      </ul>
    </nav>
  );
}