import React, { useState } from 'react'
import styled from 'styled-components'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import Token from './Token'
import question from './assets/question.svg'
import { useConvertLogic } from '../../web3-contract-token'
import { breakpoint } from '../../microsite-logic'

const large = css => breakpoint('large', css)

function FormSection() {
  let errorMessage = 'Amount is greater than balance held'
  const disabled = !!errorMessage || !this.canSubmit()
  const [amount, setAmount] = useState('')
  const convertLogic = useConvertLogic()
  return (
    <Form
      onSubmit={event => {
        event.preventDefault()
        convertLogic.actions.convertAntToAnj(amount)
      }}
    >
      <div
        css={`
          margin-bottom: ${3 * 8}px;
        `}
      >
        <Label>
          Amount of ANT you want to convert
          <span title="Required">{'\u00a0*'}</span>
        </Label>

        <AdornmentBox>
          <Input
            type="number"
            value={amount}
            min={100}
            onChange={() => setAmount(event.target.value)}
          />
          <Adornment>
            <Token symbol="ANT" />
          </Adornment>
        </AdornmentBox>
        <Label>Amount of ANJ you will receive and activate</Label>
        <AdornmentBox>
          <Input
            type="number"
            value={amount ? amount * 10 : ''}
            min={1000}
            onChange={() => setAmount(event.target.value / 10)}
          />
          <Adornment>
            <Token symbol="ANJ" />
          </Adornment>
        </AdornmentBox>
        <OverlayTrigger
          placement="right"
          delay={{ hide: 400 }}
          overlay={function renderTooltip(props) {
            return (
              <Tooltip {...props}>
                If you enter your email address, we will notify you directly
                when the court is live and how you can participate in upcoming
                court cases. Since there are financial penalties for not
                participating in cases you are drafted in, we strongly recommend
                signing up for court notifications via email.
              </Tooltip>
            )
          }}
        >
          <Label>
            Notify me when the Court is live
            <img src={question} />
          </Label>
        </OverlayTrigger>
        <Input />
      </div>

      <Button disabled={!amount || amount <= 0} type="submit">
        Become a Juror
      </Button>
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
  margin-bottom: 34px;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
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
  font-family: 'FontMedium', sans-serif;
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
