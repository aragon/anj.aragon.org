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

const ConverterContent = () => {
  const { account } = useWeb3Connect()

  return (
    <Content>
      <div className="left">{account ? <Form /> : <Providers />}</div>
      <RightBox>
        <Balance />
        <Info />
        <Countdown />
      </RightBox>
      <div className="mobile">
        <Form />
      </div>
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
  .left,
  .right {
    width: 100%;
    text-align: left;
  }
  .left {
    display: none;
    ${large('display: inherit;')};
  }
  .mobile {
    display: inherit;
    ${large('display: none;')};
  }
  ${large('flex-direction: row; padding: 57px 35px 35px 35px; ')};
`
const RightBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 450px;
  text-align: left;
`

export default ConverterContent
