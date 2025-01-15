import { app } from './src/infra/express.js'
import { fetchProductOffers } from './src/shopee/api/fetchProdctOffers.js'
import { saveProducts } from './src/shopee/products/productsSave.js'
import { state } from './state.js'

const start = async () => {
  app.listen(state.port, () =>
    console.log(`Servidor rodando em http://localhost:${state.port}`)
  )

  const products = await fetchProductOffers(1)

  if (!products || products.length === 0) {
    const error = 'Nenhum produto encontrado.'
    console.error(error)
    return
  }

  try {
    await saveProducts(products)
  } catch (error) {
    console.log('Erro ao salvar: ', error)
  }
}
start()
