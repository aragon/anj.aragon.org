import React from 'react'
import styled from 'styled-components'
import { breakpoint } from '../../microsite-logic'
import { PREACTIVATION_END } from '../../utils'
import Timer from '../Timer'

const medium = css => breakpoint('medium', css)

const Callout = () => {
  const preactivationActive = new Date() < PREACTIVATION_END
  return (
    <CalloutContainer>
      {preactivationActive ? (
        <>
          <p>Special ANJ pre-activation rate ends in</p>
          <Timer date={PREACTIVATION_END} />
        </>
      ) : (
        <p>Manage your ANJ balance from the dashboard</p>
      )}
    </CalloutContainer>
  )
}

const CalloutContainer = styled.div`
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

export default Callout
