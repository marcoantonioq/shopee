import { state } from '../../state.js'
import { auth, spreadsheets } from '../../google/Google.js'

export let cupons = []

const toDate = (s, defaultDate) => {
  if (s instanceof Date) return s
  if (typeof s !== 'string' || s?.trim() === '') return defaultDate
  const [d, t] = s.split(' ')
  const [day, month, year] = d.split('/'),
    [h, m, sec] = t.split(':')
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(h),
    Number(m),
    Number(sec)
  )
}

const parseValue = (value, defaultValue = 0) =>
  parseFloat(value.replace('R$', '').replace('%', '').replace(',', '.')) ||
  defaultValue

export const cupom = (product) => {
  try {
    const now = new Date()

    const validCupons = cupons
      .map((cupom) => {
        try {
          if (
            now >= cupom.inicio &&
            now <= cupom.fim &&
            product.price >= cupom.valorMinimo &&
            product.price <= cupom.valorMaximo
          ) {
            cupom.discountValue = cupom.descontoReais
            if (cupom.descontoPercentual > 0) {
              cupom.discountValue = Math.min(
                product.price * (cupom.descontoPercentual / 100),
                cupom.descontoLimite
              )
            }
            if (
              (cupom.lojasOficiais && !product.shopType?.includes(1)) ||
              product.shopType?.length === 0
            ) {
              cupom.discountValue = 0
            }
          }
          return cupom
        } catch (error) {
          console.log('Cupom inválido: ', cupom, error)
          return null
        }
      })
      .filter((cupom) => cupom && cupom.discountValue > 0)
      .sort((a, b) => (b ? b.discountValue : 0) - (a ? a.discountValue : 0))

    console.log('Cupons: ', validCupons, product)
    return validCupons[0] || null
  } catch (error) {
    console.error('Erro ao processar cupons: ', error)
    return null
  }
}

export async function updateCoupons() {
  try {
    await auth(state.google.config)

    const sheets = spreadsheets()

    const result = await sheets.values.get({
      spreadsheetId: '1wiEQqmCGBOB4G9GYSa4jvFIEn-S7ut9HArx9sNCRKds',
      range: 'Cupons',
    })

    const mapearTabela = (header, data) => {
      return data.map((row) => {
        const objeto = {}
        row.forEach((value, index) => {
          objeto[header[index]] = value
        })
        return objeto
      })
    }

    if (result?.data?.values) {
      const now = new Date()
      const header = result?.data?.values[0]
      cupons = mapearTabela(header, result.data.values?.slice(1))
        .filter((cupom) => cupom['Descrição'])
        .map((c) => {
          return {
            description: c['Descrição'],
            valorMinimo: parseValue(c['Valor Mínimo'], 0),
            valorMaximo: parseValue(c['Valor Máximo'], 10000),
            descontoReais: parseValue(c['Desconto R$'], 0),
            descontoPercentual: parseValue(c['Desconto %'], 0),
            descontoLimite: parseValue(c['Desconto Limite'], 0),
            inicio: toDate(c['Início'], new Date('2025-01-01')),
            fim: toDate(c['Fim'], new Date('2030-12-31')),
            lojasOficiais: c['Lojas Oficiais'].toLowerCase() === 'true',
            discountValue: 0,
          }
        })
        .filter(
          (c) =>
            now >= toDate(c.inicio, new Date('2025-01-01')) &&
            now <= toDate(c.fim, new Date('2030-12-31'))
        )

      return cupons
    }
  } catch (error) {
    console.error('Erro ao obter cupons: ', error)
  }
}
