const path = require('path')
const { execSync } = require('child_process')
const withCSS = require('@zeit/next-css')
const withImages = require('next-images')
const { fullEnvironment } = require('./lib/environment')
const { version } = require('./package.json')

const COMMIT_SHA =
  process.env.COMMIT_SHA || execSync("git log --pretty=format:'%H' -n 1")

const BUILD = process.env.BUILD || `${version}-${COMMIT_SHA.slice(0, 7)}`

const ENV = fullEnvironment()

// Defined by Next
delete ENV.NODE_ENV

module.exports = withCSS(
  withImages({
    webpack(config, options) {
      return ['lib', 'components'].reduce((config, dirname) => {
        config.resolve.alias[dirname] = path.join(__dirname, dirname)
        return config
      }, config)
    },
    env: ENV,
  })
)
