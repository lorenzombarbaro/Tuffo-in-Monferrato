import { Fraunces } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import ViewportHeightFix from "@/components/ViewportHeightFix";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Tuffo in Monferrato",
  description: "Scopri borghi, cantine e chicche nascoste tra le colline del Monferrato",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className={`${fraunces.variable} antialiased`}>
        <ScrollToTop />
        <ViewportHeightFix />
        {children}
      </body>
    </html>
  );
}
