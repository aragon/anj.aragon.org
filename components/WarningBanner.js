import React, { useState } from 'react'
import { animated, useTransition } from 'react-spring'
import styled from 'styled-components'

const BANNER_HEIGHT = 48
const BannerDiv = styled.div`
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    rgba(255, 83, 84, 1) 0%,
    rgba(255, 113, 73, 1) 100%
  );
  box-shadow: 0px 1px 3px rgba(255, 255, 255, 0.25);
  box-sizing: border-box;
  color: white;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  text-align: center;

  p {
    margin-bottom: 0;
  }
`

function WarningBanner() {
  const [visible, setVisible] = useState(true)

  const transitions = useTransition(visible, null, {
    from: { height: 0 },
    enter: { height: BANNER_HEIGHT },
    leave: { height: 0 },
  })

  return transitions.map(({ item: visible, key, props }) => {
    return (
      visible && (
        <animated.div key={key} style={{ ...props, overflow: 'hidden' }}>
          <BannerDiv>
            <p>
              This converter uses Uniswap v1 for converting between tokens and
              ANJ. We don't recommend using it for amounts above 10,000 ANJ.
            </p>
          </BannerDiv>
        </animated.div>
      )
    )
  })
}

export default WarningBanner
