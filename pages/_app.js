import App, { Container } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import '../styles/globals.css';
import Head from 'next/head'
class MyApp extends App {
    render() {
    const { Component, pageProps } = this.props;

    return(
      <>
        <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Dosis:wght@400;500;700&family=Inter:wght@300;400;500;700&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet"/> 
   </Head>
        <NextNProgress color="#00c9de" />
        <Component {...pageProps} />
      </> 
    )
  }
}

export default MyApp;