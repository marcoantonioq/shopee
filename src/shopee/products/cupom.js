const cupons = [
  {
    name: 'CUPOM10',
    discount: '10',
    description: '🎟️APLIQUE CUPOM R$ 10 OFF: S5MM3R',
    code: 'S5MM3R',
    rule: (product) =>
      new Date() < new Date('2025-01-31') && Number(product.price) > 80,
  },
]

export const cupom = (product) => {
  try {
    return cupons.filter(({ rule }) => rule(product))[0]
  } catch (error) {
    console.error('Erro ao buscar cupom', error)
    return null
  }
}
