import React, { useEffect, useContext, useState } from 'react'
import { utils as EthersUtils } from 'ethers'
import { useKnownContract } from '../../web3-contracts'
import { useWeb3Connect } from '../../web3-connect'
import { bigNum } from '../../utils'

export const CONVERTER_STATUSES = {
  FORM: Symbol('STATE_FORM'),
  SIGNING: Symbol('STATE_SIGNING'),
  PENDING: Symbol('STATE_PENDING'),
  ERROR: Symbol('STATE_ERROR'),
  SUCCESS: Symbol('STATE_SUCCESS'),
}

const ConverterContext = React.createContext()

export function useConverterStatus() {
  return useContext(ConverterContext)
}

export function ConverterProvider({ children }) {
  const [status, setStatus] = useState(CONVERTER_STATUSES.FORM)
  const [lastAnjBought, setLastAnjBought] = useState(bigNum(-1))

  const { account } = useWeb3Connect()
  const wrapperContract = useKnownContract('WRAPPER')

  useEffect(() => {
    if (status !== CONVERTER_STATUSES.PENDING || !wrapperContract || !account) {
      return
    }

    const onBoughtAndActivated = (from, to, value) => {
      if (from === account) {
        setLastAnjBought(value)
        setStatus(CONVERTER_STATUSES.SUCCESS)
      }
    }

    wrapperContract.on('BoughtAndActivated', onBoughtAndActivated)

    return () => {
      wrapperContract.removeListener('BoughtAndActivated', onBoughtAndActivated)
    }
  }, [status, wrapperContract, account])

  return (
    <ConverterContext.Provider value={{ lastAnjBought, status, setStatus }}>
      {children}
    </ConverterContext.Provider>
  )
}
