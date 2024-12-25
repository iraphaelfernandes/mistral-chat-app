import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Chat App</title>
      </head>
      <body suppressHydrationWarning={true}>
        <div id="app-root">{children}</div>
      </body>
    </html>
  );
}
