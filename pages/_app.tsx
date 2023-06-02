import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { Figtree } from 'next/font/google';
import '../styles/globals.css';

const figtree = Figtree({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <main className={figtree.className}>
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  );
}

export default MyApp;
