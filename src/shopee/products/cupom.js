const cupons = [
  //   {
  //     name: 'CUPOM10',
  //     discount: '10',
  //     description: `🏷️ APLIQUE CUPOM 10% OFF:
  // https://s.shopee.com.br/AA1YTStpzH 🎟️`,
  //     code: 'S5MM3R',
  //     rule: (product) => {
  //       if (new Date() < new Date('2025-01-21')) {
  //         const price = Number(product.price)
  //         const desconto = price * 0.1
  //         if (desconto <= 10) {
  //           return price * 0.9
  //         } else {
  //           return price - 10
  //         }
  //       }
  //       return 0
  //     },
  //   },
  {
<<<<<<< HEAD
    name: 'CUPOM10',
    discount: '10',
    description: `🏷️ APLIQUE CUPOM 10% OFF:
https://s.shopee.com.br/AA1YTStpzH 🎟️`,
    code: 'S5MM3R',
    rule: (product) => {
      if (new Date() < new Date('2025-01-21')) {
        const price = Number(product.price)
        const desconto = price * 0.1
        if (desconto <= 10) {
          return price * 0.9
        } else {
          return price - 10
        }
      }
      return 0
    },
  },
  {
=======
>>>>>>> dev-job
    name: 'CUPOM30',
    discount: '30',
    description: `🏷️ APLIQUE CUPOM R$ 30 OFF
https://s.shopee.com.br/AA1YTStpzH 🎟️`,
    code: '',
    rule: (product) => {
      if (new Date() < new Date('2025-01-19')) {
        const price = Number(product.price)
        if (price >= 249) {
          return price - 30
        }
      }
      return 0
    },
  },
]

export const cupom = (product) => {
  try {
    const validCupons = cupons
      .map((cupom) => ({ ...cupom, discountValue: cupom.rule(product) }))
      .filter((cupom) => cupom.discountValue > 0)
      .sort((a, b) => b.discountValue - a.discountValue)

    return validCupons[0] || null
  } catch (error) {
    console.error('Erro ao buscar cupom', error)
    return null
  }
}
