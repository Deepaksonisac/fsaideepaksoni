import type {Metadata} from 'next';import './globals.css';

export const metadata: Metadata = {
  title: 'FSAI Performance Hub',
  description: 'Interactive management dashboard for the Fire & Security Association of India',
  icons: {
    icon: '/fsai-logo.svg',
  },
};

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
