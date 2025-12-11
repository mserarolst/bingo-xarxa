import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bingo Solidari - La Marató de TV3",
  description: "Aplicació per gestionar els packs de regals del Bingo Solidari",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca">
      <body className={inter.className}>
        <Toaster 
          position="top-center" 
          richColors 
          toastOptions={{
            style: {
              fontSize: '18px',
              padding: '20px',
            },
            classNames: {
              title: 'text-lg font-semibold',
              description: 'text-base',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
