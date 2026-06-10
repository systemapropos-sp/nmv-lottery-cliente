import type { ReactNode } from 'react';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function Layout({ children, showFooter = true }: LayoutProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <main className="flex flex-1 flex-col">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
