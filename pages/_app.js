import { Fragment } from 'react';
import Head from 'next/head';
import "../styles/global.css"

import 'bootstrap/dist/css/bootstrap.min.css';

export default function MyApp(props) {
  const { Component, pageProps } = props;

  return (
    <Fragment>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />

      </Head>
      <Component {...pageProps} />
    </Fragment>
  );
}

