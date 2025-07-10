import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './ui/ThemeProvider';
import ThemeToggle from './ui/ThemeToggle';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className={`${inter.className} antialiased min-h-screen flex flex-col`}>
            <header className="w-full px-6 py-4 flex justify-end items-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40">
              <ThemeToggle />
            </header>
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
