import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-static'
import Fade from 'react-reveal/Fade'
import { breakpoint } from '../microsite-logic'
import background from './assets/subscribe-background.svg'
import step1 from './assets/step1.svg'
import step2 from './assets/step2.svg'
import step3 from './assets/step3.svg'
const medium = css => breakpoint('medium', css)

const WhatHappens = () => (
  <WhatHappensSection id="about">
    <Container>
      <h3>Becoming a juror</h3>
      <p>
        To get started, you must convert ANT into the Aragon Court native token
        called ANJ. To get selected as a juror, you must stake and activate your
        ANJ. The conversion module above will convert ANT into ANJ, stake it,
        and activate it for you automatically. That way you’re ready to start
        earning rewards when Aragon Court launches.
      </p>
    </Container>
    <StepsContainer>
      <Fade bottom duration={1200} distance={'50%'} delay={300}>
        <div>
          <img src={step1} />
          <h4>Get ANJ with ANT</h4>
        </div>
      </Fade>
      <Fade bottom duration={1200} distance={'50%'} delay={600}>
        <div>
          <img src={step2} />
          <h4>Stake your ANJ</h4>
        </div>
      </Fade>
      <Fade bottom duration={1200} distance={'50%'} delay={900}>
        <div>
          <img src={step3} />
          <h4>Activate your ANJ</h4>
        </div>
      </Fade>
    </StepsContainer>
  </WhatHappensSection>
)

const WhatHappensSection = styled.section`
  background: #f9fafc;
  padding: 100px 15px 85px;
`
const Container = styled.div`
  width: 80%;
  margin: auto;
  text-align: center;

  p {
    font-family: 'FontRegular';
    font-size: 24px;
    line-height: 34px;
    text-align: center;
    color: #8a96a0;
    max-width: 800px;
    margin: auto;
  }
  h3 {
    font-family: 'FontMedium', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 37px;
    line-height: 1;
    text-align: center;
    color: #1c1c1c;
  }
`

const StepsContainer = styled.div`
  width: 80%;
  margin: 80px auto 0 auto;
  text-align: center;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  div {
    padding: 15px;
    text-align: center;
  }

  h4 {
    font-family: 'FontRegular', sans-serif;
    font-weight: 400;
    font-size: 27px;
    line-height: 38px;
    text-align: center;
    color: #1c1c1c;
    margin: 30px 0 0 0;
  }
  h6 {
    font-family: 'FontRegular', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 31px;
    text-align: center;
    margin: 0;
    color: #ff9780;
  }
  ${medium('flex-direction: row;')};
`

export default WhatHappens
