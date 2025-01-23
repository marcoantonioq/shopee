const { expect, test } = require('@jest/globals')

const extractCoupons = (text) => {
  const regex = /(cupom[:\s]?)\s*(?:🎟️\s*)?([A-Z0-9]{8,})/gi
  const matches = text.matchAll(regex)
  return [...new Set([...matches].map((match) => match[2]))]
}

test('extrai cupom do texto', () => {
  const text = `
  PARA AS MENINAS ✨💕

  ~DE 39,90~
  Por: *24,13* 🥹🤏🏼

  compre aqui:

  🎟️ Utilize o CUPOM: MODAFASHIONAF
  `

  const expectedCoupons = ['MODAFASHIONAF']
  const extractedCoupons = extractCoupons(text)

  expect(extractedCoupons).toEqual(expectedCoupons)
})
