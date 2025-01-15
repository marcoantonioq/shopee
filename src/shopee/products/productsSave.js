import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { state } from '../../../state.js'
import { auth, spreadsheets } from '../../google/Google.js'

export const saveProducts = async (products = []) => {
  if (!products.length) throw new Error('Nenhum produto informado!')

  await auth(state.google.config)
  const sheets = spreadsheets()

  const headers = Object.keys(products[0])
  const values = products.map((obj) =>
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

  const dir = './data'
  const file = `${dir}/produtos.json`

  if (!existsSync(dir)) {
    mkdirSync(dir)
  }

  const jsonContent = JSON.stringify(products, null, 2)
  try {
    writeFileSync(file, jsonContent, 'utf8')
    console.log('Arquivo JSON salvo com sucesso.')
  } catch (err) {
    console.error('Erro ao salvar o arquivo JSON:', err)
  }
}
