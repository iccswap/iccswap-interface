import { Currency, Percent, Price } from '@iccswap/sdk'
import React, { useContext, useState } from 'react'
import Reverse from '../../assets/images/reverse.png'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { RowBetween, AutoRow } from '../../components/Row'
import { ONE_BIPS } from '../../constants'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'

export function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}) {
  const theme = useContext(ThemeContext);
  const [currency, setCurrency] = useState<'A' | 'B'>('A');
  return (
    <AutoColumn gap="md">
      <RowBetween>
        {
          currency === 'A' ? (
            <RowBetween>
              <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
                价格:
              </Text>
              <TYPE.black>
                <AutoRow>
                  {price?.toSignificant(6) ?? '-'}
                  <span style={{ marginLeft: "5px" }}>{currencies[Field.CURRENCY_B]?.symbol} / {currencies[Field.CURRENCY_A]?.symbol}</span>
                  <img
                    src={Reverse}
                    alt="reverse"
                    style={{ width: "20px", cursor: "pointer" }}
                    onClick={() => {
                      setCurrency('B')
                    }}
                  />
                </AutoRow>
              </TYPE.black>
            </RowBetween>
          ) : (
              <RowBetween>
                <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
                  价格:
                </Text>
                <TYPE.black>
                  <AutoRow>
                    {price?.invert()?.toSignificant(6) ?? '-'}
                    <span style={{ marginLeft: "5px" }}>{currencies[Field.CURRENCY_A]?.symbol} / {currencies[Field.CURRENCY_B]?.symbol}</span>
                    <img
                      src={Reverse}
                      alt="reverse"
                      style={{ width: "20px", cursor: "pointer" }}
                      onClick={() => {
                        setCurrency('A')
                      }}
                    />
                  </AutoRow>
                </TYPE.black>
              </RowBetween>
            )
        }
        <div style={{ padding: "0 20px" }}>|</div>
        <RowBetween>
          <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
            预计占比:
          </Text>
          <TYPE.black>
            {noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
            %
          </TYPE.black>
        </RowBetween>
      </RowBetween>
    </AutoColumn>
  )
}
