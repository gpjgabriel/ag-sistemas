import { Inter } from "next/font/google";
import "./globals.css";
import { PrimeReactProvider } from "primereact/api";
import Tailwind from 'primereact/passthrough/tailwind';


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
    <html lang="en"> 
      <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
        <body
          className={`${inter.variable}`}
        >
          {children}
        </body>
      </PrimeReactProvider>
    </html>
  );
}
