import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShopHub',
  description: 'Votre boutique en ligne',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-white antialiased">
        {children}
      </body>
    </html>
  );
}
