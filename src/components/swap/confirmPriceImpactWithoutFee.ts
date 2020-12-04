import { Percent } from '@iccswap/sdk'
import { ALLOWED_PRICE_IMPACT_HIGH, PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN } from '../../constants'

/**
 * Given the price impact, get user confirmation.
 *
 * @param priceImpactWithoutFee price impact of the trade without the fee.
 */
export default function confirmPriceImpactWithoutFee(priceImpactWithoutFee: Percent): boolean {
  if (!priceImpactWithoutFee.lessThan(PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN)) {
    return (
      window.prompt(
        `该掉期对价格的影响至少为 ${PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN.toFixed(
          0
        )}%. 请输入"confirm"继续进行此交换。。`
      ) === 'confirm'
    )
  } else if (!priceImpactWithoutFee.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) {
    return window.confirm(
      `该掉期对价格的影响至少为 ${ALLOWED_PRICE_IMPACT_HIGH.toFixed(
        0
      )}%. 请输入"confirm"继续进行此交换。`
    )
  }
  return true
}
