import { Trade, TradeType } from '@iccswap/sdk'
import React, { useMemo, useState } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
// import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { TYPE } from '../../theme'
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity
} from '../../utils/prices'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm
}: {
  trade: Trade
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false)
  // const theme = useContext(ThemeContext)
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
    allowedSlippage,
    trade
  ])
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)

  return (
    <>
      <AutoColumn gap="0px" style={{ color: '#333', background: '#F3F4F8', padding: '20px', borderRadius: '8px' }}>
        <RowBetween style={{ marginBottom: '12px' }}>
          <RowBetween align="center" style={{ width: '40%' }}>
            <Text fontWeight={400} fontSize={14} color={'#333'}>
              价格
          </Text>
            <Text
              fontWeight={500}
              fontSize={14}
              color={'#333'}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                textAlign: 'right',
                paddingLeft: '10px'
              }}
            >
              {formatExecutionPrice(trade, showInverted)}
              <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
                <Repeat size={14} />
              </StyledBalanceMaxMini>
            </Text>
          </RowBetween>

          <RowBetween style={{ width: '40%' }}>
            <RowFixed>
              <TYPE.black fontSize={14} fontWeight={400} color={'#333'}>
                {trade.tradeType === TradeType.EXACT_INPUT ? '最低收到' : '最多支付'}
              </TYPE.black>
              <QuestionHelper text="如果在确认之前出现较大的不利价格变动，则您的交易将被取消。" />
            </RowFixed>
            <RowFixed>
              <TYPE.black fontSize={14} color={'#333'}>
                {trade.tradeType === TradeType.EXACT_INPUT
                  ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                  : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
              </TYPE.black>
              <TYPE.black fontSize={14} marginLeft={'4px'} color={'#333'}>
                {trade.tradeType === TradeType.EXACT_INPUT
                  ? trade.outputAmount.currency.symbol
                  : trade.inputAmount.currency.symbol}
              </TYPE.black>
            </RowFixed>
          </RowBetween>
        </RowBetween>
        <RowBetween>
          <RowBetween style={{ width: '40%' }}>
            <RowFixed>
              <TYPE.black color={'#333'} fontSize={14} fontWeight={400}>
                价格冲击
            </TYPE.black>
              <QuestionHelper text="您的兑换数量将决定预估成交价格与市场价格的差额。" />
            </RowFixed>
            <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
          </RowBetween>
          <RowBetween style={{ width: '40%' }}>
            <RowFixed style={{ width: '40%' }}>
              <TYPE.black fontSize={14} fontWeight={400} color={'#333'}>
                手续费
            </TYPE.black>
              <QuestionHelper text="每笔交易金额的一部分(0.3%)将作为协议激励奖励给流动性提供者。" />
            </RowFixed>
            <TYPE.black fontSize={14} color={'#333'}>
              {realizedLPFee ? realizedLPFee?.toSignificant(6) + ' ' + trade.inputAmount.currency.symbol : '-'}
            </TYPE.black>
          </RowBetween>
        </RowBetween>
      </AutoColumn>

      <AutoRow style={{ justifyContent: 'center' }}>
        <ButtonError
          onClick={onConfirm}
          disabled={disabledConfirm}
          error={severity > 2}
          style={{ margin: '10px 0 0 0', width: '350px' }}
          id="confirm-swap-or-send"
        >
          <Text fontSize={20} fontWeight={500}>
            {severity > 2 ? '仍要兑换' : '确认'}
          </Text>
        </ButtonError>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
