import React from 'react'
import styled from 'styled-components'
import Timer from './Timer'

const CountDownSection = () => (
  <CountDown>
    <p>Special ANJ pre-activation price ends in</p>
    <p>
      <Timer date={new Date('February 10, 2020 00:00:00 GMT+0000')} />
    </p>
  </CountDown>
)

const CountDown = styled.div`
  background: linear-gradient(205.14deg, #fff6f6 6.08%, #fffbf8 93.18%);
  border-left: solid 3px #ffb36d;
  border-radius: 4px;
  padding: 20px 40px;
  width: 100%;
  p {
    margin: 0;
  }
`

export default CountDownSection
