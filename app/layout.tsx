import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
