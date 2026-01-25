import {Assistant} from 'next/font/google'
import "./globals.css";
const assistantFont = Assistant({
  weight : ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap'
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
