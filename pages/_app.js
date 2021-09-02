import App, { Container } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import '../styles/globals.css';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return(
      <>
        <NextNProgress />
        <Component {...pageProps} />
      </> 
    )
  }
}

export default MyApp;