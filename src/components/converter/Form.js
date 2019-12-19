import React, { useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { BigNumber } from '@ethersproject/bignumber'
import Token from './Token'
import {
  useTokenDecimals,
  useConvertAntToAnj,
  useTokenBalance,
  useJurorRegistryAnjBalance,
} from '../../web3-contracts'
import { fromTokenInteger, toTokenInteger } from '../../web3-utils'
import { breakpoint, GU } from '../../microsite-logic'
import { useConverterStatus, CONVERTER_STATUSES } from './converter-status'

import question from './assets/question.svg'

const large = css => breakpoint('large', css)

const ANJ_BY_ANT = 100

function convertInputValue(value, fromDecimals, toDecimals, convert) {
  value = value.trim()

  if (!value || fromDecimals === -1 || toDecimals === -1) {
    return ['', '']
  }

  const fromAmount = BigNumber.from(toTokenInteger(value || '0', fromDecimals))
  const toAmount = convert(fromAmount)

  const toInputValue = value ? fromTokenInteger(toAmount, toDecimals) : ''

  return {
    fromInputValue: value,
    toInputValue,
    fromAmount,
    toAmount,
  }
}

function useConvertInputs() {
  const [inputValueAnj, setInputValueAnj] = useState('')
  const [inputValueAnt, setInputValueAnt] = useState('')
  const [amountAnj, setAmountAnj] = useState(BigNumber.from(0))
  const [amountAnt, setAmountAnt] = useState(BigNumber.from(0))

  const antDecimals = useTokenDecimals('ANT')
  const anjDecimals = useTokenDecimals('ANJ')

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
    handleAnjChange,
    handleAntChange,
    inputValueAnj,
    inputValueAnt,
  }
}

function FormSection() {
  const {
    amountAnj,
    amountAnt,
    handleAnjChange,
    handleAntChange,
    inputValueAnj,
    inputValueAnt,
  } = useConvertInputs()

  const convertAntToAnj = useConvertAntToAnj()

  const balanceAnt = useTokenBalance('ANT')
  const balanceAnj = useJurorRegistryAnjBalance()

  const converterStatus = useConverterStatus()

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      await convertAntToAnj(amountAnt.toString())
      converterStatus.setStatus(CONVERTER_STATUSES.PENDING)
    } catch (err) {
      converterStatus.setStatus(CONVERTER_STATUSES.ERROR)
    }
  }

  // const disabled = Boolean(errorMessage)
  const [placeholder, setPlaceholder] = useState('')

  useEffect(() => {
    if (balanceAnj && balanceAnj.value.gte(BigNumber.from(String(10000)))) {
      setPlaceholder('')
    } else {
      setPlaceholder('Min. 100 ANT')
    }
  }, [balanceAnj])

  const [info, setInfo] = useState('')
  const [balanceInfo, setBalanceInfo] = useState(balanceAnt.toString())
  const [validationBalance, setValidationBalance] = useState('')

  useEffect(() => {
    setBalanceInfo(balanceAnt.toString())
  }, [balanceAnt])

  useEffect(() => {
    if (
      amountAnt &&
      inputValueAnt &&
      balanceAnj &&
      balanceAnj.value.lt(BigNumber.from(String(10000)))
    ) {
      setInfo(
        amountAnt.lt(BigNumber.from(String(Math.pow(10, 18) * 100)))
          ? 'The minimum amount for this is 100. '
          : ''
      )
    }
  }, [amountAnt, inputValueAnt, balanceAnj])

  useEffect(() => {
    if (
      amountAnt &&
      inputValueAnt &&
      balanceAnt &&
      balanceAnt.value.lt(BigNumber.from(String(inputValueAnt)))
    ) {
      setValidationBalance('Amount is greater than balance held.')
    } else {
      setValidationBalance('')
    }
  }, [amountAnt, inputValueAnt, balanceAnt])

  return (
    <Form onSubmit={handleSubmit}>
      <div
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <div>
          <Label>Amount of ANT you want to convert</Label>
          <AdornmentBox>
            <Input
              type="number"
              value={inputValueAnt}
              max={balanceAnt ? balanceAnt : undefined}
              onChange={handleAntChange}
              placeholder={placeholder}
            />
            <Adornment>
              <Token symbol="ANT" />
            </Adornment>
          </AdornmentBox>
          <Info>
            <span className="black">Balance: {balanceInfo} ANT. </span>
            <span className="red">{validationBalance} </span>
          </Info>
          <Info>
            {' '}
            <span className="red">{info} </span>
          </Info>
        </div>
        <InputBox>
          <Label>Amount of ANJ you will receive and activate</Label>
          <AdornmentBox>
            <Input
              type="number"
              min={placeholder ? 10000 : undefined}
              value={inputValueAnj}
              onChange={handleAnjChange}
            />
            <Adornment>
              <Token symbol="ANJ" />
            </Adornment>
          </AdornmentBox>
        </InputBox>
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
            <img src={question} />
          </Label>
        </OverlayTrigger>
        <Input type="email" />
      </div>

      <Button type="submit">Become a Juror</Button>
    </Form>
  )
}

const Form = styled.form`
  display: flex;
  min-height: 450px;
  flex-direction: column;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 130px;
  ${large('padding-right: 30px; margin-top: 0;')};
`
const Label = styled.label`
  font-size: 24px;
  line-height: 38px;
  color: #8a96a0;

  span {
    color: #08bee5;
  }
  img {
    padding-left: 10px;
  }
`
const Info = styled.div`
  margin-top: 3px;
  height: 19px;
  .red {
    color: #ff6969;
  }
  .black {
    color: #212b36;
  }
`

const InputBox = styled.div`
  margin-bottom: 20px;
`
const Input = styled.input`
  width: 100%;
  height: 50px;
  padding: 0 12px;
  background: #ffffff;
  border: 1px solid #dde4e9;
  color: #212b36;
  border-radius: 4px;
  appearance: none;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
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
