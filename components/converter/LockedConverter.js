import React from 'react'
import styled from 'styled-components/macro'
import { breakpoint } from 'lib/microsite-logic'

import content from '../assets/convert-module.png'
import antlogo from '../assets/antlogo.svg'
import anjlogo from '../assets/anj-token.svg'
import lock from '../assets/orangelock.svg'
import contentMobile from '../assets/convert-module-mobile.png'
import {useBondingCurvePrice} from '../../lib/web3-contracts'
import { formatUnits } from '../../lib/web3-utils'

const medium = css => breakpoint('medium', css)

const LockedConverter = () => {
  const { price, loading } = useBondingCurvePrice('1000000000000000000', false)

  return (
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
            href="https://aragon.org/blog/merge-anj"
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn more
          </a>
        </p>
        <p className="pause-rate">The currently paused exchange rate is: </p>
        <div className="exchange-rate">
        <RateNumber rate="1.000" token="ANJ" showSeparator />
        <RateNumber rate={loading ? '0.014' : formatUnits(price, {
          truncateToDecimalPlace: 3
          })} token="ANT" />
        </div>
      </div>
    </div>
  </LockedConverterSection>)
}

function RateNumber({ rate, token, showSeparator }) {
  return (
    <div
      css={`
        display: flex;
        padding-right: 0px !important;
        .rate {
          font-size: 24px;
          line-height: 31px;
          padding-right: 8px;
        }
        img {
          padding-right: 8px;
        }
        .symbol {
          color: #8A96A0;
          font-size: 20px;
        }
        .separator {
          font-size: 20px;
          padding-right: 8px;
          padding-left: 8px;
        }
      `}
    >
      <span className="rate" css={`margin-right: 0px; padding-right: 0 !important;`}>{rate}</span>
      <img
        src={token === 'ANT' ? antlogo : anjlogo}
        alt="Token logo"
        css={`
          width: 32px;
          height: 32px;
          padding-bottom: 8px;
          padding-right: 0px !important;
        `}
      />
        <span className="symbol">{token}</span>
        {showSeparator && (
          <span className="separator">:</span>
          )}
    </div>
  )
}

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
    flex-direction: column;
    ${medium('flex-direction: row;')}
    align-items: center;
    justify-content: flex-start;
    padding: 20px 12px;
    div {
      padding-right: 10px;
      ${medium('padding-right: 28px;')};
    }
    p {
      font-family: 'FontRegular', sans-serif;
      font-weight: '400';
      font-size: 18px;
      line-height: 1.43;
      align-items: center;
      color: black;
      margin: 0;
      padding-bottom: 8px;
      ${medium('font-size: 23px;')};
    }
    .exchange-rate {
      display: flex;
      justify-content: center;
      ${medium('justify-content: flex-start;')}
  }
    .pause-rate {
      padding-top: 8px;
      font-size: 20px;
      color: #8a96a0;
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
