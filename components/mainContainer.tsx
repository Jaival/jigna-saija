import Head from 'next/head';
import { useRouter } from 'next/router';
import Footer from './footer';
import Navbar from './navBar';

export default function MainContainer({ children, ...customMeta }: any) {
  const router = useRouter();

  const meta = {
    title: 'Jigna Saija',
    // description: `.`,
    // image: "/avatar.png",
    type: 'website',
    ...customMeta,
  };
  // TODO: change meta content and href property containing [{`https://yourwebsite.com${router.asPath}`}]
  return (
    <div>
      <Head>
        <title>{meta.title}</title>
        <meta name='robots' content='follow, index' />
        {/* <meta content={meta.description} name="description" /> */}
        <meta
          property='og:url'
          content={`https://yourwebsite.com${router.asPath}`}
        />
        <link
          rel='canonical'
          href={`https://yourwebsite.com${router.asPath}`}
        />
        <meta property='og:type' content={meta.type} />
        <meta property='og:site_name" content="Jigna Saija' />
        {/* <meta property="og:description" content={meta.description} /> */}
        {/* <meta property="og:title" content={meta.title} /> */}
        {/* <meta property="og:image" content={meta.image} /> */}
        {/* {meta.date && (
                    <meta property="article:published_time" content={meta.date} />
                )} */}
      </Head>
      <main className='px-10 pt-12 md:px-20 bg-white-dark dark:bg-blue-dark background'>
        <Navbar />
        <div className='px-4 py-2'>{children}</div>
        <Footer />
      </main>
    </div>
  );
}
