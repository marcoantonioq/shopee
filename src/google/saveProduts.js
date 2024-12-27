import { state } from '../../state.js'
import { formatProduct } from '../utils.js'
import { auth, spreadsheets } from './Google.js'

export const saveProducts = async (products = []) => {
  if (!products.length) return

  await auth(state.google.config)
  const sheets = spreadsheets()

  // const response = await sheets.values.get({
  //   spreadsheetId: '1wiEQqmCGBOB4G9GYSa4jvFIEn-S7ut9HArx9sNCRKds',
  //   range: 'Produtos',
  // })

  // console.log('Resultado sheet: ', response.data.values)

  const headers = Object.keys(products[0])
  const values = products
    .map(formatProduct)
    .map((obj) =>
      Object.values(obj).map((value) =>
        Array.isArray(value) ? value.join(', ') : value
      )
    )
  sheets.values.update({
    spreadsheetId: '1wiEQqmCGBOB4G9GYSa4jvFIEn-S7ut9HArx9sNCRKds',
    range: 'Produtos',
    valueInputOption: 'RAW',
    requestBody: {
      values: [headers, ...values],
    },
  })
}
