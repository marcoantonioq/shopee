import { readFileSync } from 'fs'
import { formatProduct } from '../../utils.js'

export const readProducts = () => {
  try {
    // const response = await sheets.values.get({
    //   spreadsheetId: '1wiEQqmCGBOB4G9GYSa4jvFIEn-S7ut9HArx9sNCRKds',
    //   range: 'Produtos',
    // })

    // console.log('Resultado sheet: ', response.data.values)

    const data = readFileSync('./data/produtos.json', 'utf8')
    const products = JSON.parse(data).map(formatProduct)
    return products
  } catch (err) {
    console.error('Erro ao ler o arquivo JSON:', err)
    return []
  }
}
