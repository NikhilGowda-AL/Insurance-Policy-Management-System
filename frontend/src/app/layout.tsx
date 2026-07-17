import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'IPMS — Insurance Policy Management System',
  description: 'Enterprise insurance policy onboarding and issuance platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#102420',
              color: '#f6f4ee',
              fontSize: '0.875rem'
            },
            success: { iconTheme: { primary: '#146356', secondary: '#f6f4ee' } },
            error: { iconTheme: { primary: '#a83f2b', secondary: '#f6f4ee' } }
          }}
        />
      </body>
    </html>
  );
}
