import { Percent } from '@iccswap/sdk'
import React from 'react'
import { ONE_BIPS } from '../../constants'
import { warningSeverity } from '../../utils/prices'
import { ErrorText } from './styleds'

/**
 * Formatted version of price impact text with warning colors
 */
export default function FormattedPriceImpact({ priceImpact, color }: { priceImpact?: Percent, color?: string }) {
  return (
    <ErrorText fontWeight={500} fontSize={14} severity={warningSeverity(priceImpact)} color={color || '#333'}>
      {priceImpact ? (priceImpact.lessThan(ONE_BIPS) ? '<0.01%' : `${priceImpact.toFixed(2)}%`) : '-'}
    </ErrorText>
  )
}
