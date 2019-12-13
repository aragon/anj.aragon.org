const envVars = {
  CHAIN_ID: [process.env.CHAIN_ID, '1'],
}

export default function environment(name) {
  const envVar = envVars[name]
  if (!envVar) {
    return null
  }
  return envVar[0] === undefined ? envVar[1] : envVar[0]
}
