

import React from 'react'
import universal, { setHasBabelPlugin } from '/Library/WebServer/Documents/court-microsite/node_modules/react-universal-component/dist/index.js'

setHasBabelPlugin()

const universalOptions = {
  loading: () => null,
  error: props => {
    console.error(props.error);
    return <div>An error occurred loading this page's template. More information is available in the console.</div>;
  },
  ignoreBabelRename: true
}

const t_0 = universal(import('/Library/WebServer/Documents/court-microsite/src/pages/404.js'), universalOptions)
      t_0.template = '/Library/WebServer/Documents/court-microsite/src/pages/404.js'
      
const t_1 = universal(import('/Library/WebServer/Documents/court-microsite/src/pages/index.js'), universalOptions)
      t_1.template = '/Library/WebServer/Documents/court-microsite/src/pages/index.js'
      

// Template Map
export default {
  '/Library/WebServer/Documents/court-microsite/src/pages/404.js': t_0,
'/Library/WebServer/Documents/court-microsite/src/pages/index.js': t_1
}
// Not Found Template
export const notFoundTemplate = "/Library/WebServer/Documents/court-microsite/src/pages/404.js"

