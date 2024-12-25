import './globals.css';
import Navbar from '../components/Navbar';

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
        <div className="flex h-screen">
          <Navbar />
          <main className="flex-1 md:pl-[260px]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
