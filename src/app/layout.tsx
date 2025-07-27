import type { Metadata } from "next";
import { Nunito, Montserrat } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Anime Performance Bumper - Nostalgia Under 2000's",
  description: "GSP Performance - Live Concert Experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-screen w-screen">
      <head>
        {/* Font Awesome */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${nunito.variable} ${montserrat.variable} font-sans antialiased overflow-hidden h-screen w-screen m-0 p-0`}>
        {children}
      </body>
    </html>
  );
}
