import App, { Container } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import '../styles/globals.css';

class MyApp extends App {
    render() {
    const { Component, pageProps } = this.props;

    return(
      <>
        <NextNProgress color="#00c9de" />
        <Component {...pageProps} />
      </> 
    )
  }
}

export default MyApp;