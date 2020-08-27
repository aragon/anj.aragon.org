import React from 'react'
import styled from 'styled-components/macro'
import { formatUnits, STD_DECIMAL_PLACES } from 'lib/web3-utils'
import { useTokenBalance, useTokenDecimals } from 'lib/web3-contracts'

function Info() {
  const balanceAnj = useTokenBalance('ANJ')
  const anjDecimals = useTokenDecimals('ANJ')

  return (
    <InfoIn>
      <h1>Please read</h1>
      <ul>
        <li class="warning">
          <span>
            This converter uses Uniswap v1 for converting between tokens and
            ANJ. We don't recommend using it for amounts above 10,000 ANJ.
            Please use{' '}
            <a
              href="https://convert.aragon.org"
              target="blank"
              rel="noopener _noreferrer"
            >
              the bonding curve converter tool&nbsp;
            </a>
            for larger amounts.
          </span>
        </li>
        <li>
          You currently have{' '}
          {balanceAnj.eq(-1)
            ? '0'
            : formatUnits(balanceAnj, {
                digits: anjDecimals,
                replaceZeroBy: '0',
                truncateToDecimalPlace: STD_DECIMAL_PLACES,
              })}{' '}
          ANJ in your wallet.
        </li>
        <li>Minimum 10,000 ANJ is required to become a juror.</li>
        <li>ANT will be converted to ANJ.</li>
      </ul>
    </InfoIn>
  )
}

const InfoIn = styled.section`
  padding: 30px 0;
  h1 {
    line-height: 1.3;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: rgb(255, 124, 124);
  }
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    list-style: none;
    font-style: normal;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.3;
    color: #8a96a0;
    &:before {
      content: '− ';
    }
    a {
      text-decoration: underline;
      color: inherit;
    }
    span {
      color: #ff5354;
    }
  }
`

export default Info
