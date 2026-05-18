import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Catavento Finance',
  description: 'Gestão financeira do Catavento Espaço Pedagógico',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: '#26325B',
              color: '#F4F1EA',
              border: 'none',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: '600',
            },
          }}
        />
      </body>
    </html>
  );
}
