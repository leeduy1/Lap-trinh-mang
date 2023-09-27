import BigNumber from "bignumber.js";

export function formatCoinWithDotSeparators(coin: BigNumber): string {
  const coinStr = coin.toFixed(0);
  return coinStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatCoin(coin: BigNumber): string {
  if (coin.isLessThan(1000)) {
    return coin.toString();
  }

  const abbrev: string[] = ["K", "M", "B", "T"];
  let i: number = -1;

  while (coin.isGreaterThanOrEqualTo(1000) && i < abbrev.length - 1) {
    coin = coin.dividedBy(1000);
    i++;
  }

  return coin.integerValue(BigNumber.ROUND_DOWN) + abbrev[i];
}
