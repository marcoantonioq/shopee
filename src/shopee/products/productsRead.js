import { readFileSync } from 'fs'
import { formatProduct } from '../../utils.js'

export const readProducts = () => {
  try {
    const data = readFileSync('./data/produtos.json', 'utf8')
    const products = JSON.parse(data).map(formatProduct)
    return products
  } catch (err) {
    console.error('Erro ao ler o arquivo JSON:', err)
    return []
  }
}
