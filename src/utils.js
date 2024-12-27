export const formatValue = (value) => {
  if (typeof value === 'number' || !isNaN(value)) {
    return Number(value)
  }
  return value
}

export const formatProduct = (product) => ({
  ...product,
  periodStartTime: product.periodStartTime
    ? new Date(Number(product.periodStartTime) * 1000).toISOString()
    : null,
  periodEndTime: product.periodEndTime
    ? new Date(Number(product.periodEndTime) * 1000).toISOString()
    : null,
  commissionRate: formatValue(product.commissionRate),
  commission: formatValue(product.commission),
  price: formatValue(product.price),
  priceMin: formatValue(product.priceMin),
  priceMax: formatValue(product.priceMax),
  ratingStar: product.ratingStar ? Number(product.ratingStar) : null,
})
