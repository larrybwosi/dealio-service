import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { CartProvider } from "@/contexts/cart"
// import { Providers } from "@/components/providers"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
