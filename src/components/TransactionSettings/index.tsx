import React, { useState, useRef, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

import QuestionHelper from '../QuestionHelper'
import { TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed, RowFlex } from '../Row'

import { darken } from 'polished'

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh'
}

enum DeadlineError {
  InvalidInput = 'InvalidInput'
}

const FancyButton = styled.button`
  color: ${({ theme }) => theme.text1};
  align-items: center;
  height: 2rem;
  border-radius: 36px;
  font-size: 12px;
  width: auto;
  min-width: 3rem;
  border: 1px solid ${({ theme }) => theme.bg3};
  outline: none;
  background: ${({ theme }) => theme.bg1};
  :hover {
    border: 1px solid ${({ theme }) => theme.bg4};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
`

const Option = styled(FancyButton) <{ active: boolean }>`
  margin-right: 8px;
  width:70px;
  height:2.5rem;
  border-radius:4px;
  :hover {
    cursor: pointer;
  }
  background-color: ${({ active, theme }) => active && '#5277E7'};
  color: ${({ active, theme }) => (active ? theme.white : theme.text1)};
`

const Input = styled.input`
  background: ${({ theme }) => theme.bg1};
  font-size: 16px;
  width: auto;
  outline: none;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  color: ${({ theme, color }) => (color === 'red' ? theme.red1 : theme.text1)};
  text-align: right;
`

const OptionCustom = styled(FancyButton) <{ active?: boolean; warning?: boolean }>`
  height: 2.5rem;
  position: relative;
  padding: 0 0.75rem;
  width:90px;
  border-radius:4px;
  border: ${({ theme, active, warning }) => active && `1px solid ${warning ? theme.red1 : theme.primary1}`};
  :hover {
    border: ${({ theme, active, warning }) =>
    active && `1px solid ${warning ? darken(0.1, theme.red1) : darken(0.1, theme.primary1)}`};
  }

  input {
    width: 100%;
    height: 100%;
    border: 0px;
    border-radius: 2rem;
  }
`

const SlippageEmojiContainer = styled.span`
  color: #f3841e;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;  
  `}
`

export interface SlippageTabsProps {
  rawSlippage: number
  setRawSlippage: (rawSlippage: number) => void
  deadline: number
  setDeadline: (deadline: number) => void
}

export default function SlippageTabs({ rawSlippage, setRawSlippage, deadline, setDeadline }: SlippageTabsProps) {
  const theme = useContext(ThemeContext)

  const inputRef = useRef<HTMLInputElement>()

  const [slippageInput, setSlippageInput] = useState('')
  const [deadlineInput, setDeadlineInput] = useState('')

  const slippageInputIsValid =
    slippageInput === '' || (rawSlippage / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  const deadlineInputIsValid = deadlineInput === '' || (deadline / 60).toString() === deadlineInput

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && rawSlippage < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && rawSlippage > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
  }

  function parseCustomSlippage(value: string) {
    setSlippageInput(value)

    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setRawSlippage(valueAsIntFromRoundedFloat)
      }
    } catch { }
  }

  function parseCustomDeadline(value: string) {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
        setDeadline(valueAsInt)
      }
    } catch { }
  }

  return (
    <AutoColumn>
      <RowFlex style={{ background: '#121512', padding: '24px 20px', width: '100%', marginBottom: '50px', justifyContent: 'space-around', borderRadius: '8px' }}>
        <RowFixed>
          <QuestionHelper text="如果实际兑换价格超不利方向变化的幅度超过您设置的百分比，您的交易将被取消" />
          <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
            价格滑点：
            <Input
            style={{background:'none',border:'none',width:'44px'}}
                  ref={inputRef as any}
                  placeholder={(rawSlippage / 100).toFixed(2)}
                  value={slippageInput}
                  onBlur={() => {
                    parseCustomSlippage((rawSlippage / 100).toFixed(2))
                  }}
                  // onChange={e => parseCustomSlippage(e.target.value)}
                  color={!slippageInputIsValid ? 'red' : ''}
                />
              %
          </TYPE.black>
        </RowFixed>
        <RowFixed>
          <QuestionHelper text="如果等待时间超过了您的设置，您的交易将被取消" />
          <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
            交易截止时间：
              <Input
              style={{background:'none',border:'none',width:'44px'}}
                color={!!deadlineError ? 'red' : undefined}
                onBlur={() => {
                  parseCustomDeadline((deadline / 60).toString())
                }}
                placeholder={(deadline / 60).toString()}
                value={deadlineInput}
                // onChange={e => parseCustomDeadline(e.target.value)}
              />分钟
          </TYPE.black>
        </RowFixed>
      </RowFlex>
      <RowFlex style={{ justifyContent: 'space-between' }}>
        <AutoColumn gap="sm" style={{ background: '#121512', padding: '40px 20px', gridRowGap: '30px', width: '340px', borderRadius: '8px' }}>
          <RowFixed>
            <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
              设置价格滑点
          </TYPE.black>
          </RowFixed>
          <RowBetween>
            <Option
              onClick={() => {
                setSlippageInput('')
                setRawSlippage(50)
              }}
              active={rawSlippage === 50}
            >
              0.5%
          </Option>
            <Option
              onClick={() => {
                setSlippageInput('')
                setRawSlippage(100)
              }}
              active={rawSlippage === 100}
            >
              1%
          </Option>
            <OptionCustom active={![10, 50, 100].includes(rawSlippage)} warning={!slippageInputIsValid} tabIndex={-1}>
              <RowBetween>
                {!!slippageInput &&
                  (slippageError === SlippageError.RiskyLow || slippageError === SlippageError.RiskyHigh) ? (
                    <SlippageEmojiContainer>
                      <span role="img" aria-label="warning">
                        ⚠️
                  </span>
                    </SlippageEmojiContainer>
                  ) : null}
                {/* https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451 */}
                <Input
                  ref={inputRef as any}
                  placeholder={(rawSlippage / 100).toFixed(2)}
                  value={slippageInput}
                  onBlur={() => {
                    parseCustomSlippage((rawSlippage / 100).toFixed(2))
                  }}
                  onChange={e => parseCustomSlippage(e.target.value)}
                  color={!slippageInputIsValid ? 'red' : ''}
                />
              %
            </RowBetween>
            </OptionCustom>
          </RowBetween>
          {!!slippageError && (
            <RowBetween
              style={{
                fontSize: '14px',
                paddingTop: '7px',
                color: slippageError === SlippageError.InvalidInput ? 'red' : '#F3841E'
              }}
            >
              {slippageError === SlippageError.InvalidInput
                ? '输入有效的价格滑点'
                : slippageError === SlippageError.RiskyLow
                  ? '您的交易可能失败'
                  : '您的实际成交价格可能会被影响'}
            </RowBetween>
          )}
        </AutoColumn>

        <AutoColumn gap="sm" style={{ background: '#121512', padding: '40px 20px', gridRowGap: '30px', width: '340px', borderRadius: '8px' }}>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              设置交易截止时间
          </TYPE.black>
          </RowFixed>
          <RowFixed>
            <OptionCustom style={{ width: '240px' }} tabIndex={-1}>
              <Input
                color={!!deadlineError ? 'red' : undefined}
                onBlur={() => {
                  parseCustomDeadline((deadline / 60).toString())
                }}
                maxLength={4}
                placeholder={(deadline / 60).toString()}
                value={deadlineInput}
                onChange={e => parseCustomDeadline(e.target.value)}
              />
            </OptionCustom>
            <TYPE.body style={{ paddingLeft: '8px' }} fontSize={14}>
              分钟
          </TYPE.body>
          </RowFixed>
        </AutoColumn>
      </RowFlex>
    </AutoColumn>
  )
}
