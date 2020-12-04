import { Currency, CurrencyAmount, Fraction, Percent } from '@iccswap/sdk'
import React from 'react'
import { Text } from 'rebass'
import { ButtonPrimary } from '../../components/Button'
import { RowBetween, RowFixed, RowFlat } from '../../components/Row'
// import CurrencyLogo from '../../components/CurrencyLogo'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'
import { useUserSlippageTolerance } from '../../state/user/hooks'

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  const [allowedSlippage] = useUserSlippageTolerance()
  return (
    <>
      <RowBetween>
        {/* <TYPE.body style={{ color: '#333' }}>{currencies[Field.CURRENCY_A]?.symbol} 存入数量</TYPE.body>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
          <TYPE.body style={{ color: '#333' }}>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</TYPE.body>
        </RowFixed> */}
        <RowBetween style={{ background: '#EBEEF8', height: '50px', borderRadius: '4px',padding:'0 20px', marginBottom:'40px' }}>
          <RowFixed style={{ width: '45%' }}>
            <TYPE.body style={{ color: '#333' }}>价格</TYPE.body>
            <TYPE.body style={{ color: '#333' }}>
              {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${currencies[Field.CURRENCY_B]?.symbol
                }`}
            </TYPE.body>
          </RowFixed>
          <RowBetween style={{ width: '45%' }}>
            <TYPE.body style={{ color: '#333' }}>预计占比:</TYPE.body>
            <TYPE.body style={{ color: '#333' }}>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</TYPE.body>
          </RowBetween>
        </RowBetween>
      </RowBetween>
      <TYPE.body style={{ color: '#333', textAlign: 'center' }}>您将获得的数量为预估值，若价格变动超过{allowedSlippage /
            100}%您的交易将被取消</TYPE.body>
      {/* <RowBetween>
        <TYPE.body style={{ color: '#333' }}>{currencies[Field.CURRENCY_B]?.symbol} 存入数量</TYPE.body>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
          <TYPE.body style={{ color: '#333' }}>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</TYPE.body>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <TYPE.body style={{ color: '#333' }}>价格</TYPE.body>
        <TYPE.body style={{ color: '#333' }}>
          {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${currencies[Field.CURRENCY_B]?.symbol
            }`}
        </TYPE.body>
      </RowBetween>
      <RowBetween style={{ justifyContent: 'flex-end' }}>
        <TYPE.body style={{ color: '#333' }}>
          {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${currencies[Field.CURRENCY_A]?.symbol
            }`}
        </TYPE.body>
      </RowBetween>
      <RowBetween>
        <TYPE.body style={{ color: '#333' }}>预计占比:</TYPE.body>
        <TYPE.body style={{ color: '#333' }}>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</TYPE.body>
      </RowBetween> */}
      <RowFlat style={{ width: '100%', justifyContent: 'center' }}>
        <ButtonPrimary style={{ margin: '20px 0 0 0', width: '400px' }} onClick={onAdd}>
          <Text fontWeight={500} fontSize={20}>
            {noLiquidity ? '确认' : '确认'}
          </Text>
        </ButtonPrimary>
      </RowFlat>
    </>
  )
}
