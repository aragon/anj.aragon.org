import React from 'react'
import styled from 'styled-components'
import { breakpoint } from '../microsite-logic'
import about1 from './assets/about1.svg'
import about2 from './assets/about2.svg'

const medium = css => breakpoint('medium', css)

const About = () => (
  <AboutSection>
    <Section>
      <Container>
        <img src={about1} />
        <div className="right">
          <h6>January 7th</h6>
          <h2>Effective dispute resolution</h2>
          <h4>
            The Aragon about encompasses a set of courts, which can be used to
            settle disputes. By using smart contracts, cases can be closed way
            faster than in traditional courts. Fairness for everyone.
          </h4>
        </div>
      </Container>
    </Section>
    <Section>
      <Container>
        <Small>
          <img src={about2} />
        </Small>
        <div className="left">
          <h6>Early February</h6>
          <h2>Anonymity and trust, together</h2>
          <h4>
            Mom probably advised you not to interact with strangers. But thanks
            to the Aragon about, you can transact with people who are using
            aliases, or stay anonymous yourself. You can open disputes if
            someone misbehaves.
          </h4>
        </div>
        <Medium>
          <img src={about2} />
        </Medium>
      </Container>
    </Section>
  </AboutSection>
)

const AboutSection = styled.section`
  background: #f9fafc;
  padding: 0;
  text-align: center;
`

const Section = styled.section`
  width: 80%;
  margin: auto;
  padding: 0px 15px 80px 15px;
`

const Small = styled.div`
  display: block;
  ${medium('display: none;')};
  text-align: center;
  img {
    margin: auto;
  }
`
const Medium = styled.div`
  display: none;
  ${medium('display: block;')};
`

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  ${medium('flex-direction: row;')};
  padding: 50px 0;
  img {
    max-width: 70%;
    margin-bottom: 30px;
    ${medium('max-width: 90%; margin-bottom: 0;')};
  }
  div {
    max-width: 480px;
  }
  div.right {
    ${medium('padding-left: 50px;')};
  }
  div.left {
    ${medium('padding-right: 50px;')};
  }
  h2 {
    font-family: 'FontMedium', sans-serif;
    font-weight: 500;
    font-size: 38px;
    line-height: 42px;
    text-align: left;
    color: #1c1c1c;
    ${medium('text-align: left;')};
  }
  h4 {
    font-family: 'FontRegular', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 34px;
    text-align: left;
    color: #8a96a0;
    ${medium('text-align: left;')};
  }
  h6 {
    font-family: 'FontRegular', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 31px;
    text-align: left;
    color: #ff9780;
  }
`

export default About
