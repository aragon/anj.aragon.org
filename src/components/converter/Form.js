import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import {
  useTokenDecimals,
  useConvertAntToAnj,
  useConvertTokenToAnj,
  useTokenBalance,
  useJurorRegistryAnjBalance,
  useEthBalance,
} from '../../web3-contracts'
import { bigNum, usePostEmail } from '../../utils'
import { breakpoint, GU } from '../../microsite-logic'
import { formatUnits, parseUnits } from '../../web3-utils'
import { useConverterStatus, CONVERTER_STATUSES } from './converter-status'
import ComboInput from './ComboInput'
import Token from './Token'
import Anchor from '../Anchor'

import question from './assets/question.svg'

const large = css => breakpoint('large', css)

const ANJ_BY_ANT = 100
const ANJ_MIN_REQUIRED = bigNum(10)
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

  const toAmount = convert(fromAmount)

  // fromInputValue and toInputValue are filtered values to be set on inputs (strings).
  const fromInputValue = value
  const toInputValue = formatUnits(toAmount, { digits: toDecimals })

  return { fromInputValue, toInputValue, fromAmount, toAmount }
}

// Convert the two input values as the user types
function useConvertInputs() {
  const [inputValueAnj, setInputValueAnj] = useState('')
  const [inputValueAnt, setInputValueAnt] = useState('')
  const [amountAnj, setAmountAnj] = useState(bigNum(0))
  const [amountAnt, setAmountAnt] = useState(bigNum(0))

  const antDecimals = useTokenDecimals('ANT')
  const anjDecimals = useTokenDecimals('ANJ')

  // Alternate the comma-separated format, based on the fields focus state.
  const setEditModeAnt = useCallback(
    editMode => {
      setInputValueAnt(
        formatUnits(amountAnt, { digits: antDecimals, commas: !editMode })
      )
    },
    [amountAnt, antDecimals]
  )

  const setEditModeAnj = useCallback(
    editMode => {
      setInputValueAnj(
        formatUnits(amountAnj, { digits: anjDecimals, commas: !editMode })
      )
    },
    [amountAnj, anjDecimals]
  )

  const handleAntChange = useCallback(
    event => {
      if (antDecimals === -1 || anjDecimals === -1) {
        return
      }

      const converted = convertInputValue(
        event.target.value,
        antDecimals,
        anjDecimals,
        amount => amount.mul(ANJ_BY_ANT)
      )

      if (converted === null) {
        return
      }

      setInputValueAnt(converted.fromInputValue)
      setInputValueAnj(converted.toInputValue)
      setAmountAnt(converted.fromAmount)
      setAmountAnj(converted.toAmount)
    },
    [antDecimals, anjDecimals]
  )

  const handleAnjChange = useCallback(
    event => {
      if (antDecimals === -1 || anjDecimals === -1) {
        return
      }

      const converted = convertInputValue(
        event.target.value,
        anjDecimals,
        antDecimals,
        amount => amount.div(ANJ_BY_ANT)
      )

      if (converted === null) {
        return
      }

      setInputValueAnj(converted.fromInputValue)
      setInputValueAnt(converted.toInputValue)
      setAmountAnj(converted.fromAmount)
      setAmountAnt(converted.toAmount)
    },
    [antDecimals, anjDecimals]
  )

  return {
    amountAnj,
    amountAnt,
    setEditModeAnj,
    setEditModeAnt,
    handleAnjChange,
    handleAntChange,
    inputValueAnj,
    inputValueAnt,
  }
}

function FormSection() {
  const [selectedOption, setSelectedOption] = useState(0)
  const [tokenBalance, setTokenBalance] = useState(bigNum(0))
  const options = useMemo(() => ['ANT', 'DAI', 'ETH', 'USD'], [])
  const selectedTokenBalance =
    useTokenBalance(options[selectedOption]) || bigNum(0)
  const ethBalance = useEthBalance()

  useEffect(() => {
    setTokenBalance(selectedTokenBalance)
  }, [options, selectedOption, selectedTokenBalance])

  const {
    amountAnj,
    amountAnt,
    setEditModeAnj,
    setEditModeAnt,
    handleAnjChange,
    handleAntChange,
    inputValueAnj,
    inputValueAnt,
  } = useConvertInputs()

  const convertAntToAnj = useConvertAntToAnj()
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
    }

    try {
      converterStatus.setStatus(CONVERTER_STATUSES.SIGNING)
      const tx = await convertTokenToAnj(amountAnt.toString())
      converterStatus.setStatus(CONVERTER_STATUSES.PENDING)
      await tx.wait(1)
      converterStatus.setStatus(CONVERTER_STATUSES.SUCCESS)
    } catch (err) {
      converterStatus.setStatus(CONVERTER_STATUSES.ERROR)
    }
  }

  const [placeholder, setPlaceholder] = useState('')

  useEffect(() => {
    if (balanceAnj && balanceAnj.gte(bigNum(String(10000)))) {
      setPlaceholder('')
    } else {
      setPlaceholder('Min. 100 ANT')
    }
  }, [balanceAnj])

  const antError = useMemo(() => {
    if (
      amountAnt &&
      inputValueAnt &&
      balanceAnj &&
      balanceAnj.lt(ANJ_MIN_REQUIRED) &&
      amountAnj.lt(ANJ_MIN_REQUIRED)
    ) {
      return 'The minimum amount of ANT is 100.'
    }

    const selectedTokenBalance =
      options[selectedOption] === 'ETH' ? ethBalance : tokenBalance

    if (amountAnt && amountAnt.gte(0) && amountAnt.gt(selectedTokenBalance)) {
      return 'Amount is greater than balance held.'
    }

    return null
  }, [
    amountAnt,
    inputValueAnt,
    balanceAnj,
    amountAnj,
    tokenBalance,
    ethBalance,
    options,
    selectedOption,
  ])

  const disabled = Boolean(
    !inputValueAnt.trim() ||
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
            value={inputValueAnt}
            onChange={handleAntChange}
            options={[
              <Token symbol="ANT" />,
              <Token symbol="DAI" />,
              <Token symbol="ETH" />,
              <Token symbol="USD" />,
            ]}
            onBlur={() => {
              setEditModeAnt(false)
              console.log('hm')
            }}
            onFocus={() => setEditModeAnt(true)}
            onSelect={handleSelect}
            selectedOption={selectedOption}
            placeholder={placeholder}
          />
          <Info>
            <span>
              Balance:{' '}
              {formatUnits(
                options[selectedOption] === 'ETH' ? ethBalance : tokenBalance,
                {
                  digits: antDecimals,
                  replaceZeroBy: '0',
                }
              )}{' '}
              {`${options[selectedOption]}.`}
            </span>
            {antError && <span className="error">{antError} </span>}
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
            {options[selectedOption] !== 'ANT' && (
              <Info>
                This amount is an approximation.
                <OverlayTrigger
                  show="true"
                  placement="top"
                  delay={{ hide: 400 }}
                  overlay={props => (
                    <Tooltip {...props} show="true">
                      The amount is approximate since we use an external
                      provider for this transaction and we do not know the final
                      amount until the transaction is undermined.
                    </Tooltip>
                  )}
                >
                  <span className="insight"> Why?</span>
                </OverlayTrigger>
              </Info>
            )}
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
