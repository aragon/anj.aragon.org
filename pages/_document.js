import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components/macro'

const ANALYTICS_CODE = `
  var Countly = Countly || {};
  Countly.q = Countly.q || [];
  //provide countly initialization parameters
  Countly.app_key = 'c7af1bb8d7e7175b40dae267b8c2010d9913d9c8';
  Countly.url = 'https://analytics.aragon.org/';
  Countly.inactivity_time = 10;
  Countly.q.push(['track_sessions']);
  Countly.q.push(['track_pageview']);
  Countly.q.push(['track_clicks']);
  Countly.q.push(['track_errors']);
  (function() {
    var cly = document.createElement('script'); cly.type = 'text/javascript';
    cly.async = true;
    cly.src = 'https://analytics.aragon.org/sdk/web/countly.min.js';
    cly.onload = function(){Countly.init()};
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(cly, s);
  })();
`

function AnalyticsScript() {
  return process.env.NODE_ENV !== 'production' ? null : (
    <script dangerouslySetInnerHTML={{ __html: ANALYTICS_CODE }} />
  )
}

export default class extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const { renderPage } = ctx

    try {
      ctx.renderPage = () => {
        return renderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        })
      }

      const initialProps = await Document.getInitialProps(ctx)

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.png" />
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
            integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
            crossOrigin="anonymous"
          />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@AragonProject" />
          <meta
            name="twitter:description"
            content="Become a juror for Aragon Court"
          />
          <meta name="twitter:title" content="Aragon Court" />
          <meta
            name="twitter:image"
            content="https://raw.githubusercontent.com/aragon/jurors-microsite/master/public/twitter-card-icon.png"
          />

          <meta property="og:title" content="Aragon Court" />
          <meta
            property="og:description"
            content="Become a juror for Aragon Court"
          />
          <meta property="og:url" content="https://court.aragon.org/" />
          <meta property="og:site_name" content="Aragon Court" />
          <meta
            property="og:image"
            content="https://raw.githubusercontent.com/aragon/jurors-microsite/master/public/twitter-card-icon.png"
          />
          <meta
            property="og:image:secure_url"
            content="https://raw.githubusercontent.com/aragon/jurors-microsite/master/public/twitter-card-icon.png"
          />
          <meta property="og:image:width" content="300" />
          <meta property="og:image:height" content="300" />

          <meta name="description" content="Become a juror for Aragon Court" />
          <style>{`html { background: #1c1c1c }`}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
          <AnalyticsScript />
        </body>
      </Html>
    )
  }
}
