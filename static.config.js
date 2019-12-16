import path from 'path'
import React from 'react'

const REACT_STATIC_PATHS = {
  src: 'src',
  dist: 'dist',
  devDist: 'dist',
  public: 'public',
}


export default {
  siteRoot: process.env.SITE_ROOT || '',
  basePath: '',
  getRoutes: () => [
    {
      path: '/',
      component: 'src/pages/index',
      getData: () => ({ title: '' }),
    },
    
  ],
  paths: REACT_STATIC_PATHS,
  plugins: [
    [
      require.resolve('react-static-plugin-source-filesystem'),
      {
        location: path.resolve('./src/pages'),
      },
    ],
    require.resolve('react-static-plugin-reach-router'),
    require.resolve('react-static-plugin-sitemap'),
  ],
  beforeRenderToHtml: (render, Comp, meta) => {
    const sheet = new ServerStyleSheet()
    const html = render(sheet.collectStyles(<Comp />))
    meta.styleTags = sheet.getStyleElement()
    return html
  },
  Document: class CustomHtml extends React.Component {
    render() {
      const {
        Html,
        Head,
        Body,
        children,
        renderMeta,
      } = this.props
      return (
        <Html>
          <Head>
            <meta charSet="UTF-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <title>Aragon Court</title>
            <link rel="icon" href="/favicon.png" />
            <link
              rel="stylesheet"
              href="https://maxcdn.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
              integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
              crossOrigin="anonymous"
            />

            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@AragonProject" />
            <meta name="twitter:description" content="Become a juror for Aragon Court" />
            <meta name="twitter:title" content="Aragon Court" />
            <meta name="twitter:image" content="https://raw.githubusercontent.com/aragon/jurors-microsite/master/public/twitter-card-icon.png" />

            <meta property="og:title" content="Aragon Court" />
            <meta property="og:description" content="Become a juror for Aragon Court" />
            <meta property="og:url" content="https://court.aragon.org/" />
            <meta property="og:site_name" content="Aragon Court" />
            <meta property="og:image" content="https://raw.githubusercontent.com/aragon/jurors-microsite/master/public/twitter-card-icon.png" />
            <meta property="og:image:secure_url" content="https://raw.githubusercontent.com/aragon/jurors-microsite/master/public/twitter-card-icon.png" />
            <meta property="og:image:width" content="300" />
            <meta property="og:image:height" content="300" />

            <meta name="description" content="Become a juror for Aragon Court" />
          </Head>
          <Body>
            {children}
          </Body>
        </Html>
      )
    }
  },
}
