export function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatMileage(n: number) {
  return `${formatNumber(n)} mi`;
}
