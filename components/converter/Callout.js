import React from 'react'
import styled from 'styled-components/macro'
import { breakpoint } from 'lib/microsite-logic'

const medium = css => breakpoint('medium', css)

function Callout() {
  return (
    <CalloutContainer>
      <p>
        Manage your ANJ balance from the{' '}
        <a className="pink" href="http://court.aragon.org/">
          dashboard
        </a>
        . You can use{' '}
        <a
          className="pink"
          href="https://uniswap.exchange/swap?inputCurrency=0xcD62b1C403fa761BAadFC74C525ce2B51780b184?outputCurrency=0x960b236A07cf122663c4303350609A66A7B288C0"
        >
          Uniswap
        </a>{' '}
        to convert ANJ to other tokens such as ETH or DAI, and our own{' '}
        <a className="pink" href="https://convert.aragon.org/">
          Converter
        </a>{' '}
        tool, that uses the bonding curve on the background, to exchange ANT to
        ANJ and back at a better price.
      </p>
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
    font-size: 20px !important;
    margin: 0;
    line-height: 135% !important;
  }
  ${medium('padding: 20px 40px;')};

  .pink {
    color: rgba(1, 191, 227);
    background: linear-gradient(
      to right,
      #ff7c7c 20%,
      #ffc58f 40%,
      #ffc58f 60%,
      #ff7c7c 80%
    );
    background-size: 200% auto;
    background-clip: text;
    text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    animation: shine 4s linear infinite;
    ${medium('display: inline;')};
  }
`

export default Callout
