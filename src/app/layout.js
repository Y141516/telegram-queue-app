export const metadata = {
  title: "Telegram Queue App",
  description: "Mini App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}