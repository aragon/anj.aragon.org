import React from 'react'
import styled from 'styled-components'
import { breakpoint } from '../../microsite-logic'
import { useWeb3Connect } from '../../web3-connect'
import Form from './Form'
import Balance from './Balance'
import Providers from './Providers'
import Info from './Info'
import Countdown from './Countdown'

const large = css => breakpoint('large', css)

function ConverterContent() {
  const { account } = useWeb3Connect()
  return (
    <Content>
      <div className="primary">{account ? <Form /> : <Providers />}</div>
      <div className="secondary">
        <Balance />
        <Info />
        <Countdown />
      </div>
      <div className="primary-mobile">{account ? <Form /> : <Providers />}</div>
    </Content>
  )
}

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 20px 15px 40px 15px;
  height: 100%;
  .primary,
  .secondary {
    width: 100%;
    height: 100%;
    text-align: left;
  }
  .primary {
    display: none;
    ${large('display: inherit;')};
  }
  .primary-mobile {
    display: inherit;
    ${large('display: none;')};
  }
  .secondary {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    text-align: left;
  }
  ${large('flex-direction: row; padding: 57px 35px 35px 35px; ')};
`

export default ConverterContent
