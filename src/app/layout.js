import "./globals.css"
import Script from "next/script"
import { ThemeProvider } from "./components/providers/ThemeProvider"
import { LanguageProvider } from "./components/providers/LanguageProvider"

export const metadata = {
  title: "Messenger App",
  description: "Messenger Application",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-white dark:bg-neutral-950 text-black dark:text-white transition-colors duration-300">
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
