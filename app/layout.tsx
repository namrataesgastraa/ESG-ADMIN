// app/layout.tsx
import { Raleway } from 'next/font/google'

import Providers from '@/components/Providers'

import './globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  weight: ['300', '400', '500', '600', '700'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={raleway.variable}>
      {/* No flex or sidebar here, just the base */}
      <body className="font-raleway bg-[#FDFCF9] antialiased">S
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
