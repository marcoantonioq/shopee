import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())

const cupons = [
  {
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

export async function getCoupons() {
  const browser = await puppeteer.launch({
    headless: true,
    userDataDir: './user_data',
  })
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  )
  await page.setViewport({ width: 750, height: 900 })
  await page.goto('https://shopee.com.br/m/cupom-de-desconto')

  // Selecione os elementos que contêm os cupons
  const coupons = await page.$$eval('.coupon-item', (elements) => {
    return elements.map((element) => {
      const title = element?.querySelector('.coupon-title')?.textContent
      const value = element?.querySelector('.coupon-value')?.textContent
      return { title, value }
    })
  })

  console.log(coupons)

  await browser.close()
}
