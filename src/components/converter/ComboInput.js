import React, { useState, useEffect, useCallback, useRef } from 'react'
import styled from 'styled-components'
import 'styled-components/macro'
import { animated, useSpring } from 'react-spring'
import Arrow from './assets/arrow.svg'

const ESCAPE_KEY = 27
const AnimDiv = animated.div
const noop = () => {}

function ComboInput({
  inputValue,
  options = [''],
  selectedOption = 0,
  onBlur = noop,
  onChange = noop,
  onFocus = noop,
  onSelect = noop,
  placeholder,
}) {
  const [opened, setOpened] = useState(false)
  const dropdownRef = useRef()
  const inputRef = useRef()
  const { openProgress } = useSpring({
    openProgress: opened ? 1 : 0,
    config: { mass: 0.5, tension: 800, friction: 30 },
  })
  useEffect(() => {
    if (opened && dropdownRef.current) {
      dropdownRef.current.focus()
    }
  }, [opened])
  const handleSelect = useCallback(
    optionIndex => {
      setOpened(opened => !opened)
      onSelect(optionIndex)
    },
    [onSelect]
  )

  return (
    <ComboContainer>
      <Input
        value={inputValue}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        ref={inputRef}
      />
      <Dropdown
        onClick={e => {
          e.preventDefault()
          setOpened(isOpen => {
            return !isOpen
          })
        }}
      >
        <div className="header">{options[selectedOption]}</div>
        <AnimDiv
          style={{
            position: 'absolute',
            right: 0,
            padding: '8px',
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
      </Dropdown>
      <AnimDiv
        style={{
          opacity: openProgress,
          pointerEvents: opened ? 'auto' : 'none',
        }}
      >
        <DropdownContent
          tabIndex="0"
          ref={dropdownRef}
          onBlur={e => {
            if (e.relatedTarget && !e.relatedTarget.id) {
              setOpened(false)
            }
          }}
          onKeyDown={e => {
            if (e.keyCode === ESCAPE_KEY) {
              setOpened(false)
              inputRef.current.focus()
            }
          }}
        >
          <ul>
            <li>
              {options.map((option, index) => (
                <button
                  id={index}
                  onClick={e => {
                    e.preventDefault()
                    handleSelect(index)
                  }}
                  key={index}
                  css={`
                    border: none;
                    padding: 0;
                    display: flex;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                  `}
                >
                  {option}
                </button>
              ))}
            </li>
          </ul>
        </DropdownContent>
      </AnimDiv>
    </ComboContainer>
  )
}

export default ComboInput

const ComboContainer = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 50px;
  background: #ffffff;
  display: flex;
  padding: 0;
`

const Input = styled.input`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 50px;
  padding: 6px 12px 0;
  background: #ffffff;
  border: 1px solid #dde4e9;
  color: #212b36;
  border-radius: 4px 4px 4px 4px;
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

const Dropdown = styled.button`
  position: absolute;
  right: 0;
  z-index: 2;
  width: 120px;
  height: 50px;
  background: transparent;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-width: 0 0 0 1px;
  border-radius: 0 4px 4px 0;
  border-style: solid;
  border-color: #dde4e9;
  color: #212b36;
  cursor: pointer;
  .header {
    position: absolute;
    left: 0;
    padding: 0;
    width: 100%;
  }
`

const DropdownContent = styled.div`
  position: absolute;
  z-index: 2;
  top: 100%;
  right: 0;
  margin: 0;
  width: 20%;
  width: 120px;
  min-height: 50px;
  height: auto;
  border: 1px solid #dde4e9;
  border-radius: 0 4px 4px 4px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  ul {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    list-style: none;
    li {
      width: 100%;
      height: 100%;
    }
  }
`

const ArrowSVG = styled.img`
  position: relative;
`
