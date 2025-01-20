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
    console.log('Cupons: ', cupons)

    const validCupons = cupons
      .filter((cupom) => cupom['Descrição'])
      .map((cupom) => {
        try {
          const c = {
            description: cupom['Descrição'],
            valorMinimo: parseValue(cupom['Valor Mínimo'], 0),
            valorMaximo: parseValue(cupom['Valor Máximo'], 10000),
            descontoReais: parseValue(cupom['Desconto R$'], 0),
            descontoPercentual: parseValue(cupom['Desconto %'], 0),
            descontoLimite: parseValue(cupom['Desconto Limite'], 0),
            inicio: toDate(cupom['Início'], new Date('2025-01-01')),
            fim: toDate(cupom['Fim'], new Date('2030-12-31')),
            lojasOficiais: cupom['Lojas Oficiais'] === true,
            discountValue: 0,
          }

          if (
            now >= c.inicio &&
            now <= c.fim &&
            product.price >= c.valorMinimo &&
            product.price <= c.valorMaximo
          ) {
            c.discountValue = c.descontoReais
            if (c.descontoPercentual > 0) {
              c.discountValue = Math.min(
                product.price * (c.descontoPercentual / 100),
                c.descontoLimite
              )
            }
            if (c.lojasOficiais && product.shopType !== 1) {
              c.discountValue = 0
            }
          }
          return c
        } catch (error) {
          console.log('Cupom inválido: ', cupom, error)
          return null
        }
      })
      .filter((cupom) => cupom && cupom.discountValue > 0)
      .sort((a, b) => (b ? b.discountValue : 0) - (a ? a.discountValue : 0))

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
      const header = result?.data?.values[0]
      cupons = mapearTabela(header, result.data.values?.slice(1))
      console.log('Cupons atualizados: ', cupons.length)
      return cupons
    }
  } catch (error) {
    console.error('Erro ao obter cupons: ', error)
  }
}
