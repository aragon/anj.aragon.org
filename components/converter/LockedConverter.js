import React from 'react'
import styled from 'styled-components/macro'
import { breakpoint } from 'lib/microsite-logic'

import content from '../assets/convert-module.png'
import lock from '../assets/orangelock.svg'
import contentMobile from '../assets/convert-module-mobile.png'

const medium = css => breakpoint('medium', css)

const LockedConverter = () => (
  <LockedConverterSection id="get-anj">
    <Content className="medium" src={content} />
    <Content className="mobile" src={contentMobile} />
    <div className="lock" href="#how-it-works">
      <img src={lock} alt="Lock" />
      <div>
        <p>
          We have submitted a{' '}
          <a
            href="https://gov.aragon.org/#/aragon"
            rel="noopener noreferrer"
            target="_blank"
          >
            proposal
          </a>{' '}
          to merge ANJ back into ANT and in the meantime, trading is paused.
        </p>
        <p>
          <a
            href="https://gov.aragon.org/#/aragon"
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn more
          </a>
        </p>
      </div>
    </div>
  </LockedConverterSection>
)

const LockedConverterSection = styled.section`
  background: linear-gradient(
    to top,
    #fff 0%,
    #fff 83.5%,
    #1c1c1c 83.5%,
    #1c1c1c 100%
  ) !important;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  .lock {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 328px;
    background: #ffffff;
    border: 2px solid rgba(212, 220, 227, 0.5);
    box-sizing: border-box;
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 20px 12px;
    div {
      padding-right: 10px;
      ${medium('padding-right: 28px;')};
    }
    p {
      font-family: 'FontRegular', sans-serif;
      font-size: 18px;
      line-height: 1.43;
      align-items: center;
      color: black;
      margin: 0;
      padding-bottom: 8px;
      ${medium('font-size: 23px;')};
    }
    a {
      color: #ff9683;
    }
    ${medium('max-width: 724px;')};
  }
  .lock img {
    max-width: 94px;
    padding-right: 10px;
    ${medium('padding-right: 16px;')};
  }
  .mobile {
    display: inline;
    ${medium('display: none;')};
  }
  .medium {
    display: none;
    ${medium('display: inline;')};
  }
`
const Content = styled.img`
  margin: 0 auto;
  max-width: 90%;
  ${medium('max-width: calc(80% + 30px);')};
`

export default LockedConverter
