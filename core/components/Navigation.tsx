'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  showPDFInfo?: boolean;
}

export default function Navigation({ showPDFInfo = true }: NavigationProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pdfInfo, setPdfInfo] = useState<{ name: string } | null>(null);

  // Load PDF info when component mounts
  React.useEffect(() => {
    async function loadPDFInfo() {
      try {
        // This would typically fetch from an API, but for simplicity we'll just use a hardcoded value
        // In a real implementation, you would fetch this from an API endpoint
        const pdfName = 'Current PDF: pbradygeorgen_resume.pdf';
        setPdfInfo({ name: pdfName });
      } catch (error) {
        console.error('Error loading PDF info:', error);
      }
    }

    if (showPDFInfo) {
      loadPDFInfo();
    }
  }, [showPDFInfo]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Get the current pathname
  const currentPath = pathname || '';

  // Only show certain links on non-home pages
  const isHomePage = currentPath === '/';

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/pdf-styles', label: 'PDF Styles', hideOnHome: true },
    { href: '/upload', label: 'Upload PDF', hideOnHome: true },
    { href: '/view', label: 'View Resume', hideOnHome: true },
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-logo">
          <Link href="/">
            AlexAI
          </Link>
        </div>

        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          {navLinks
            .filter(link => !isHomePage || !link.hideOnHome)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? 'active' : ''}
              >
                {link.label}
              </Link>
            ))}
        </div>

        {showPDFInfo && pdfInfo && (
          <div className="pdf-info">
            {pdfInfo.name}
          </div>
        )}
      </div>

      <style jsx>{`
        .navigation {
          background-color: var(--pdf-nav-bg, #3a6ea5);
          color: var(--pdf-nav-text, #ffffff);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .nav-logo {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .nav-logo a {
          color: var(--pdf-nav-text, #ffffff);
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          gap: 1.5rem;
        }

        .nav-links a {
          color: var(--pdf-nav-text, #ffffff);
          text-decoration: none;
          padding: 0.5rem 0;
          position: relative;
        }

        .nav-links a:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--pdf-nav-text, #ffffff);
          transition: width 0.3s ease;
        }

        .nav-links a:hover:after,
        .nav-links a.active:after {
          width: 100%;
        }

        .pdf-info {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          margin-left: 1rem;
        }

        .menu-toggle {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 30px;
          height: 21px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .menu-toggle span {
          display: block;
          height: 3px;
          width: 100%;
          background-color: var(--pdf-nav-text, #ffffff);
          border-radius: 3px;
        }

        @media (max-width: 768px) {
          .menu-toggle {
            display: flex;
          }

          .nav-links {
            display: none;
            width: 100%;
            flex-direction: column;
            gap: 0.5rem;
            margin-top: 1rem;
          }

          .nav-links.open {
            display: flex;
          }

          .pdf-info {
            width: 100%;
            margin: 1rem 0 0 0;
            text-align: center;
          }
        }
      `}</style>
    </nav>
  );
}
