import React from 'react'
import styled from 'styled-components'
import { breakpoint } from '../../microsite-logic'
import Form from './Form'
import Balance from './Balance'
import Info from './Info'
import Countdown from './Countdown'

const medium = css => breakpoint('medium', css)

const ConverterContent = () => (
  <Content>
    <div className="left">
      <Form />
    </div>
    <RightBox>
      <Balance />
      <Info />
      <Countdown />
    </RightBox>
  </Content>
)

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 57px 35px 35px 35px;
  height: 100%;
  .left,
  .right {
    width: 100%;
    text-align: left;
  }
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
