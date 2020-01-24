import React, { useState } from 'react'
import styled from 'styled-components'
import { animated, useSpring } from 'react-spring'
import Token from './Token'
import Arrow from './assets/arrow.svg'

const AnimDiv = animated.div
function ComboInput({
  inputValue,
  options,
  selectedOption,
  onSelect,
  onChangeInput,
  setEditMode,
}) {
  const [opened, setOpened] = useState(false)
  const { openProgress } = useSpring({
    openProgress: opened ? 1 : 0,
  })
  React.useEffect(() => {
    console.log(openProgress)
    console.log(opened)
  }, [openProgress, opened])
  return (
    <ComboContainer>
      <Input
        value={inputValue}
        onChange={onChangeInput}
        onBlur={() => setEditMode(false)}
        onFocus={() => setEditMode(true)}
      />
      <Dropdown>
        <div
          className="selected"
          style={{ display: 'flex' }}
          onClick={() => setOpened(isOpen => !isOpen)}
        >
          <Token symbol="ETH" />
          <AnimDiv
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: openProgress.interpolate(v => {
                return `rotate(${(1 - v) * 180}deg)`
              }),
              transformOrigin: '50% calc(50% - 0.5px)',
            }}
          >
            <ArrowSVG src={Arrow} alt="" />
          </AnimDiv>
        </div>
        <AnimDiv
          style={{
            opacity: openProgress,
            pointerEvents: openProgress ? 'pointer' : 'none',
          }}
        >
          <DropdownContent>
            {[<Token symbol="ANT" />].map(token => (
              <div
                css={`
                  width: 100%;
                  height: 100%;
                `}
              >
                {token}
              </div>
            ))}
          </DropdownContent>
        </AnimDiv>
      </Dropdown>
    </ComboContainer>
  )
}

export default ComboInput

const ComboContainer = styled.div`
  position: relative;
  width: 100%;
  height: 50px;
  background: #ffffff;
  display: flex;
  padding: 0;
`

const Input = styled.input`
  width: 80%;
  height: 50px;
  padding: 6px 12px 0;
  background: #ffffff;
  border: 1px solid #dde4e9;
  color: #212b36;
  border-radius: 4px 0 0 4px;
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

const Dropdown = styled.div`
  position; relative;
  width: 20%;
  min-width: 114px;
  height: 50px;
  background: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-width: 1px 1px 1px 0;
  border-style: solid;
  border-color: #dde4e9;
  color: #212b36;
  border-radius: 0 4px 4px 0;
  .selected {
    cursor: pointer;
  }
`
const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  right: 0%;
  margin: 0;
  width: 115px;
  min-height: 50px;
  border: 1px solid #dde4e9;
  border-radius: 0 4px 4px 0;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ArrowSVG = styled.img`
  position: relative;
`
