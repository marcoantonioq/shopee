import { existsSync, readFileSync, writeFileSync } from 'fs'

export const productAdvertised = async (products, limit = 1) => {
  try {
    const file = './data/advertised.json'
    const advertised = existsSync(file)
      ? JSON.parse(readFileSync(file, 'utf8') || '[]')
      : []

    // Filtra os produtos que ainda não foram anunciados
    const newProducts = products.filter(
      (product) => !advertised.some((item) => item.itemId === product.itemId)
    )

    // Ordena os produtos pelos critérios fornecidos
    const sortedProducts = newProducts.sort((a, b) => {
      return (
        b.ratingStar - a.ratingStar || // Rating em ordem decrescente
        b.priceDiscountRate - a.priceDiscountRate || // Desconto em ordem decrescente
        b.commissionRate - a.commissionRate || // Comissão por taxa em ordem decrescente
        b.commission - a.commission || // Comissão em ordem decrescente
        a.priceMin - b.priceMin // Preço mínimo em ordem crescente
      )
    })

    // Seleciona os produtos limitados ao número fornecido
    const selectedProducts = sortedProducts.slice(0, limit)

    // Adiciona os produtos selecionados ao arquivo de anunciados
    advertised.push(...selectedProducts)

    // Salva os produtos atualizados no arquivo
    writeFileSync(
      './data/advertised.json',
      JSON.stringify(advertised, null, 2),
      'utf8'
    )

    // Retorna os produtos selecionados
    return selectedProducts
  } catch (err) {
    console.error('Erro ao salvar produto anunciado:', err)
    return []
  }
}
