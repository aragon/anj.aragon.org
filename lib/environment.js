const ENV_VARS = {
  CHAIN_ID: [process.env.CHAIN_ID, '1'],
  FORTMATIC_API_KEY: [process.env.FORTMATIC_API_KEY, ''],
  SENTRY_DSN: [process.env.SENTRY_DSN, ''],
  PORTIS_DAPP_ID: [process.env.PORTIS_DAPP_ID, ''],
  SUBSCRIPTIONS_URL: [
    process.env.SUBSCRIPTIONS_URL,
    'https://court-backend.eth.aragon.network/subscriptions',
  ],
  BACKEND_URL: [
    process.env.BACKEND_URL,
    'https://court-backend.eth.aragon.network',
  ],
  COMMIT_SHA: [process.env.COMMIT_SHA, ''],
  BUILD: [process.env.BUILD, ''],
  NODE_ENV: [process.env.NODE_ENV, 'development'],
}

function environment(name) {
  const envVar = ENV_VARS[name]
  if (!envVar) {
    return null
  }
  return envVar[0] === undefined ? envVar[1] : envVar[0].trim()
}

function fullEnvironment() {
  return Object.fromEntries(
    Object.keys(ENV_VARS).map(key => [key, environment(key)])
  )
}

// Important: use CJS in this file so it can get imported by next.config.js.
module.exports = environment
module.exports.fullEnvironment = fullEnvironment
