const ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/

export function isAddress(address) {
  return ADDRESS_REGEX.test(address)
}

export function shortenAddress(address, charsLength = 4) {
  const prefixLength = 2 // "0x"
  if (!address) {
    return ''
  }
  if (address.length < charsLength * 2 + prefixLength) {
    return address
  }
  return (
    address.slice(0, charsLength + prefixLength) +
    '…' +
    address.slice(-charsLength)
  )
}

export function getNetworkName(chainId) {
  if (chainId === '1') return 'Mainnet'
  if (chainId === '4') return 'Rinkeby'
  return 'Unknown'
}

export function identifyProvider(provider) {
  if (provider && provider.isMetaMask) {
    return 'metamask'
  }
  return 'unknown'
}
