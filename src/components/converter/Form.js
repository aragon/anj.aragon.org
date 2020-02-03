import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import * as Sentry from '@sentry/browser'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { toWei, fromWei } from 'web3-utils'
import {
  useTokenDecimals,
  useConvertTokenToAnj,
  useTokenBalance,
  useJurorRegistryAnjBalance,
  useEthBalance,
} from '../../web3-contracts'
import { bigNum, usePostEmail, useUniswapTokenRate } from '../../utils'
import { breakpoint, GU } from '../../microsite-logic'
import { formatUnits, parseUnits } from '../../web3-utils'
import { useConverterStatus, CONVERTER_STATUSES } from './converter-status'
import ComboInput from './ComboInput'
import Token from './Token'
import Anchor from '../Anchor'

import question from './assets/question.svg'

const large = css => breakpoint('large', css)
const options = ['ANT', 'DAI', 'ETH', 'USDC']
const ANJ_MIN_REQUIRED = bigNum(0)
  .pow(18)
  .mul(10000)

// Convert an input value (e.g. ANT) into another one (e.g. ANJ).
function convertInputValue(value, fromDecimals, toDecimals, convert) {
  value = value.trim()

  if (fromDecimals === -1 || toDecimals === -1) {
    return null
  }

  // fromAmount and toAmount are the parsed values (BigNumber instances).
  const fromAmount = parseUnits(value)
  if (fromAmount.lt(0)) {
    return null
  }

  const toAmount = bigNum(
    fromWei(convert(fromAmount).toString(), 'ether').split('.')[0]
  )
  // fromInputValue and toInputValue are filtered values to be set on inputs (strings).
  const fromInputValue = value
  const toInputValue = formatUnits(toAmount, {
    digits: toDecimals,
  })

  return { fromInputValue, toInputValue, fromAmount, toAmount }
}

// Convert the two input values as the user types
function useConvertInputs(tokenToAntRate, antToTokenRate) {
  const [inputValueAnj, setInputValueAnj] = useState('')
  const [inputValueToken, setInputValueToken] = useState('')
  const [amountAnj, setAmountAnj] = useState(bigNum(0))
  const [amountToken, setAmountToken] = useState(bigNum(0))
  const antDecimals = useTokenDecimals('ANT')
  const anjDecimals = useTokenDecimals('ANJ')

  // Reset the inputs anytime the selected token changes
  useEffect(() => {
    setInputValueToken('')
    setInputValueAnj('')
    setAmountAnj(bigNum(0))
    setAmountToken(bigNum(0))
  }, [tokenToAntRate])

  // Alternate the comma-separated format, based on the fields focus state.
  const setEditModeToken = useCallback(
    editMode => {
      const units = formatUnits(amountToken, {
        digits: antDecimals,
        commas: !editMode,
      })
      setInputValueToken(units)
    },
    [amountToken, antDecimals]
  )

  const setEditModeAnj = useCallback(
    editMode => {
      setInputValueAnj(
        formatUnits(amountAnj, {
          digits: anjDecimals,
          commas: !editMode,
        })
      )
    },
    [amountAnj, anjDecimals]
  )

  const handleAntChange = useCallback(
    event => {
      if (antDecimals === -1 || anjDecimals === -1) {
        return
      }

      const properTokenRate = bigNum(toWei(tokenToAntRate.toString()))
      const converted = convertInputValue(
        event.target.value,
        antDecimals,
        anjDecimals,
        amount => properTokenRate.mul(amount).mul(100)
      )

      if (converted === null) {
        return
      }

      setInputValueToken(converted.fromInputValue)
      setInputValueAnj(converted.toInputValue)
      setAmountToken(converted.fromAmount)
      setAmountAnj(converted.toAmount)
    },
    [antDecimals, anjDecimals, tokenToAntRate]
  )

  const handleAnjChange = useCallback(
    event => {
      if (antDecimals === -1 || anjDecimals === -1) {
        return
      }

      const properTokenRate = bigNum(toWei(antToTokenRate.toString()))
      const converted = convertInputValue(
        event.target.value,
        anjDecimals,
        antDecimals,
        amount => properTokenRate.mul(amount).div(100)
      )

      if (converted === null) {
        return
      }

      setInputValueAnj(converted.fromInputValue)
      setInputValueToken(converted.toInputValue)
      setAmountAnj(converted.fromAmount)
      setAmountToken(converted.toAmount)
    },
    [antDecimals, anjDecimals, antToTokenRate]
  )

  return {
    amountAnj,
    amountToken,
    setEditModeAnj,
    setEditModeToken,
    handleAnjChange,
    handleAntChange,
    inputValueAnj,
    inputValueToken,
  }
}

function FormSection() {
  const [selectedOption, setSelectedOption] = useState(0)
  const tokenBalance = useTokenBalance(options[selectedOption])
  const ethBalance = useEthBalance()
  const tokenRate = useUniswapTokenRate(options[selectedOption])
  const {
    amountAnj,
    amountToken,
    setEditModeAnj,
    setEditModeToken,
    handleAnjChange,
    handleAntChange,
    inputValueAnj,
    inputValueToken,
  } = useConvertInputs(tokenRate.rate, tokenRate.rateInverted)

  const convertTokenToAnj = useConvertTokenToAnj(options[selectedOption])
  const postEmail = usePostEmail()

  const balanceAnj = useJurorRegistryAnjBalance()
  const antDecimals = useTokenDecimals('ANT')

  const converterStatus = useConverterStatus()
  const [email, setEmail] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const handleSubmit = async event => {
    event.preventDefault()

    try {
      await postEmail(email)
    } catch (err) {
      console.error(`Error while trying to subscribe ${email}`, err)
      converterStatus.setStatus(CONVERTER_STATUSES.ERROR)
      return
    }

    try {
      const selectedToken = options[selectedOption]
      converterStatus.setStatus(
        selectedToken === 'DAI' || selectedToken === 'USDC'
          ? CONVERTER_STATUSES.SIGNING_ERC
          : CONVERTER_STATUSES.SIGNING
      )
      const tx = await convertTokenToAnj(amountToken, amountAnj.div(100))
      converterStatus.setStatus(CONVERTER_STATUSES.PENDING)
      await tx.wait(1)
      converterStatus.setStatus(CONVERTER_STATUSES.SUCCESS)
    } catch (err) {
      console.log(err)
      if (process.env.NODE_ENV === 'production') {
        Sentry.captureException(err)
      }
      converterStatus.setStatus(CONVERTER_STATUSES.ERROR)
    }
  }

  const [placeholder, setPlaceholder] = useState('')
  const selectedTokenBalance =
    options[selectedOption] === 'ETH' ? ethBalance : tokenBalance

  useEffect(() => {
    if (balanceAnj && balanceAnj.gte(bigNum(String(10000)))) {
      setPlaceholder('')
    } else {
      setPlaceholder('Min. 100 ANT')
    }
  }, [balanceAnj])

  const antError = useMemo(() => {
    if (
      amountToken &&
      inputValueToken &&
      balanceAnj &&
      balanceAnj.lt(ANJ_MIN_REQUIRED) &&
      amountAnj.lt(ANJ_MIN_REQUIRED)
    ) {
      return 'The minimum amount of ANT is 100.'
    }

    if (
      amountToken &&
      amountToken.gte(0) &&
      amountToken.gt(selectedTokenBalance) &&
      !selectedTokenBalance.eq(-1)
    ) {
      return 'Amount is greater than balance held.'
    }

    return null
  }, [
    amountToken,
    inputValueToken,
    balanceAnj,
    amountAnj,
    selectedTokenBalance,
  ])
  const disabled = Boolean(
    !inputValueToken.trim() ||
      !inputValueAnj.trim() ||
      antError ||
      converterStatus.status !== CONVERTER_STATUSES.FORM ||
      !/[^@]+@[^@]+/.test(email) ||
      !acceptTerms
  )
  const handleSelect = useCallback(
    optionIndex => setSelectedOption(optionIndex),
    []
  )

  const formattedTokenBalance = selectedTokenBalance.eq(-1)
    ? 'Fetching...'
    : `${formatUnits(
        options[selectedOption] === 'ETH' ? ethBalance : tokenBalance,
        {
          digits: antDecimals,
          replaceZeroBy: '0',
        }
      )} ${options[selectedOption]}.`

  return (
    <Form onSubmit={handleSubmit}>
      <div
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <div>
          <Label>Amount of {options[selectedOption]} you want to convert</Label>
          <ComboInput
            inputValue={inputValueToken}
            onChange={handleAntChange}
            options={[
              <Token symbol="ANT" />,
              <Token symbol="DAI" />,
              <Token symbol="ETH" />,
              <Token symbol="USDC" />,
            ]}
            onBlur={() => setEditModeToken(false)}
            onFocus={() => setEditModeToken(true)}
            onSelect={handleSelect}
            selectedOption={selectedOption}
            placeholder={placeholder}
          />
          <Info>
            <span>Balance:{` ${formattedTokenBalance}`}</span>
            {antError && <span className="error"> {antError} </span>}
          </Info>
        </div>
        <div>
          <InputBox>
            <Label>Amount of ANJ you will receive and activate</Label>
            <AdornmentBox>
              <Input
                value={inputValueAnj}
                onChange={handleAnjChange}
                onBlur={() => setEditModeAnj(false)}
                onFocus={() => setEditModeAnj(true)}
              />
              <Adornment>
                <Token symbol="ANJ" />
              </Adornment>
            </AdornmentBox>
            <Info>
              {options[selectedOption] !== 'ANT' ? (
                <>
                  This amount is an approximation.
                  <OverlayTrigger
                    show="true"
                    placement="top"
                    delay={{ hide: 400 }}
                    overlay={props => (
                      <Tooltip {...props} show="true">
                        The amount is approximate since we use an external
                        provider for this transaction and we do not know the
                        final amount until the transaction is undermined.
                      </Tooltip>
                    )}
                  >
                    <span className="insight"> Why?</span>
                  </OverlayTrigger>
                </>
              ) : (
                ' ' // prevent page jumps when selecting a token
              )}
            </Info>
          </InputBox>
        </div>
        <OverlayTrigger
          placement="right"
          delay={{ hide: 400 }}
          overlay={props => (
            <Tooltip {...props} show="true">
              If you enter your email address, we will notify you directly when
              the court is live and how you can participate in upcoming court
              cases. Since there are financial penalties for not participating
              in cases you are drafted in, we strongly recommend signing up for
              court notifications via email.
            </Tooltip>
          )}
        >
          <Label>
            Notify me when the Court is live
            <img src={question} alt="" />
          </Label>
        </OverlayTrigger>
        <Input type="email" onChange={event => setEmail(event.target.value)} />
      </div>

      <Conditions>
        <label>
          <input
            type="checkbox"
            onChange={() => setAcceptTerms(acceptTerms => !acceptTerms)}
            checked={acceptTerms}
          />
          By clicking on “Become a juror”, you are accepting the{' '}
          <Anchor href="https://anj.aragon.org/legal/terms-general.pdf">
            court terms
          </Anchor>
          , the{' '}
          <Anchor href="https://anj.aragon.org/legal/terms-jurors.pdf">
            juror terms
          </Anchor>{' '}
          and the{' '}
          <Anchor href="https://aragon.one/email-collection.md">
            email collection policy
          </Anchor>
          .
        </label>
      </Conditions>

      <Button type="submit" disabled={disabled}>
        Become a Juror
      </Button>
    </Form>
  )
}

const Form = styled.form`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-direction: column;
  margin-top: 130px;
  ${large('padding-right: 30px; margin-top: 0;')};
`

const Conditions = styled.p`
  margin: 24px 0;

  label {
    display: block;
    font-size: 16px;
    line-height: 1.3;
    margin-bottom: 0;
  }

  input {
    margin-right: 8px;
    vertical-align: text-top;
  }
`

const Label = styled.label`
  font-size: 24px;
  line-height: 38px;
  color: #8a96a0;
  margin-bottom: 6px;

  span {
    color: #08bee5;
  }
  img {
    padding-left: 10px;
  }
`
const Info = styled.div`
  margin-top: 3px;
  margin-bottom: 12px;
  color: #212b36;
  .error {
    color: #ff6969;
  }
  .insight {
    color: #516dff;
  }
`

const InputBox = styled.div`
  margin-bottom: 20px;
`
const Input = styled.input`
  width: 100%;
  height: 50px;
  padding: 6px 12px 0;
  background: #ffffff;
  border: 1px solid #dde4e9;
  color: #212b36;
  border-radius: 4px;
  appearance: none;
  font-size: 20px;
  font-weight: 400;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
  -moz-appearance: textfield;
  &:focus {
    outline: none;
    border-color: #08bee5;
  }
  &::placeholder {
    color: #8fa4b5;
    opacity: 1;
  }
  &:invalid {
    box-shadow: none;
  }
`

const Button = styled.button`
  background: linear-gradient(189.76deg, #ffb36d 6.08%, #ff8888 93.18%);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  border: solid 0px transparent;
  border-radius: 6px;
  color: white;
  width: 100%;
  height: 52px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  &:disabled,
  &[disabled] {
    opacity: 0.5;
    cursor: inherit;
  }
`

const Adornment = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  height: 50px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AdornmentBox = styled.div`
  display: inline-flex;
  position: relative;
  width: 100%;
  input {
    padding-right: 39px;
  }
`
export default FormSection
