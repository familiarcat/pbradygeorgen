'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the PdfContentLayout with no SSR
const PdfContentLayout = dynamic(() => import('@/components/layouts/PdfContentLayout'), {
  ssr: false,
});

interface PdfContentWrapperProps {
  children: React.ReactNode;
}

export default function PdfContentWrapper({ children }: PdfContentWrapperProps) {
  return <PdfContentLayout>{children}</PdfContentLayout>;
}
