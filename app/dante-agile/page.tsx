'use client';

import { useState } from 'react';
import Link from 'next/link';
import DanteAgileLayout from '@/components/dante-agile/DanteAgileLayout';
import { DanteLogger } from '@/utils/DanteLogger';

export default function DanteAgilePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    DanteLogger.success.ux(`Navigated to ${tab} tab`);
  };
  
  return (
    <DanteAgileLayout activeTab={activeTab} onTabChange={handleTabChange} />
  );
}
