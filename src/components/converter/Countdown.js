import React from 'react'
import styled from 'styled-components'
import Timer from './Timer'
import { breakpoint } from '../../microsite-logic'
import { ACTIVATION_END } from '../../utils'

const medium = css => breakpoint('medium', css)

const CountDownSection = () => (
  <CountDown>
    <p>Special ANJ pre-activation rate ends in</p>
    <Timer date={ACTIVATION_END} />
  </CountDown>
)

const CountDown = styled.div`
  background: linear-gradient(205.14deg, #fff6f6 6.08%, #fffbf8 93.18%);
  border-left: solid 3px #ffb36d;
  border-radius: 4px;
  padding: 15px;
  position: relative;
  width: 100%;
  p {
    margin: 0;
    line-height: 1.1 !important;
    ${medium('line-height: 38px !important;')};
  }
  ${medium('padding: 20px 40px;')};
`

export default CountDownSection
