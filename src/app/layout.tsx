import { Inter } from "next/font/google";
import "./globals.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "AG SISTEMAS",
  description: "Gestão de grupos de networking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <PrimeReactProvider>
        <body
          className={`${inter.variable} font-sans bg-gray-100 text-gray-900 antialiased`}
        >
          {children}
        </body>
      </PrimeReactProvider>
    </html>
  );
}
