import { Trade, TradeType } from '@iccswap/sdk'
import React, { useContext, useMemo } from 'react'
import { AlertTriangle } from 'react-feather'
import arrowRight from '../../assets/images/arrowRight.png'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { TYPE } from '../../theme'
import { ButtonPrimary } from '../Button'
import { isAddress, shortenAddress } from '../../utils'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween, RowFixed, RowFlex } from '../Row'
import { TruncatedText, SwapShowAcceptChanges } from './styleds'

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges
}: {
  trade: Trade
  allowedSlippage: number
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}) {
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
    trade,
    allowedSlippage
  ])
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const theme = useContext(ThemeContext)

  return (
    <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
      <RowFlex style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <RowFlex style={{ width: '300px', height: '80px', border: '3px solid #C0CFFC', lineHeight: '75px', borderRadius: '8px', justifyContent: 'center' }}>
          <RowFixed gap={'0px'}>
            <CurrencyLogo currency={trade.inputAmount.currency} size={'22px'} style={{ marginRight: '12px' }} />
            <TruncatedText
              fontSize={20}
              fontWeight={500}
              color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? theme.primary1 : ''}
            >
              {trade.inputAmount.toSignificant(6)}
            </TruncatedText>
          </RowFixed>
          <RowFixed gap={'0px'}>
            <Text fontSize={20} fontWeight={500} style={{ marginLeft: '10px' }}>
              {trade.inputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowFlex>
        <RowFixed>
          <img
            src={arrowRight}
            alt="arrowRight"
            style={{ width: "20px" }}
          />
        </RowFixed>
        <RowFlex style={{ width: '300px', height: '80px', border: '3px solid #C0CFFC', lineHeight: '75px', borderRadius: '8px', justifyContent: 'center' }}>
          <RowFixed gap={'0px'}>
            <CurrencyLogo currency={trade.outputAmount.currency} size={'22px'} style={{ marginRight: '12px' }} />
            <TruncatedText
              fontSize={20}
              fontWeight={500}
              color={
                priceImpactSeverity > 2
                  ? theme.red1
                  : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                    ? theme.primary1
                    : ''
              }
            >
              {trade.outputAmount.toSignificant(6)}
            </TruncatedText>
          </RowFixed>
          <RowFixed gap={'0px'}>
            <Text fontSize={20} fontWeight={500} style={{ marginLeft: '10px' }}>
              {trade.outputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowFlex>
      </RowFlex>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap={'0px'}>
          <RowBetween>
            <RowFixed>
              <AlertTriangle size={20} style={{ marginRight: '8px', minWidth: 24 }} />
              <TYPE.main color={theme.primary1}> 价格已变动，请重新确认。</TYPE.main>
            </RowFixed>
            <ButtonPrimary
              style={{ padding: '.5rem', width: 'fit-content', fontSize: '0.825rem', borderRadius: '12px' }}
              onClick={onAcceptChanges}
            >
              接受价格变动
            </ButtonPrimary>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <TYPE.italic textAlign="left" style={{ width: '100%', fontSize: '14px', textAlign: 'center', color: '#666' }}>
            {`您将获得的数量为预估值，您最低将收到 `}
            <b>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {trade.outputAmount.currency.symbol}
            </b>
            {' 否则交易将被取消'}
          </TYPE.italic>
        ) : (
            <TYPE.italic textAlign="left" style={{ width: '100%', fontSize: '14px', textAlign: 'center', color: '#666' }}>
              {`您将获得的数量为预估值，您将至少获得 `}
              <b>
                {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {trade.inputAmount.currency.symbol}
              </b>
              {' 否则交易将被取消'}
            </TYPE.italic>
          )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <TYPE.main>
            Output will be sent to{' '}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </TYPE.main>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
