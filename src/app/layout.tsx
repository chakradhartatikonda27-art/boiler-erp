import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Broiler Integration Management Platform',
  description: 'Enterprise Poultry Operations & Financial Control ERP',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-900 bg-slate-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
