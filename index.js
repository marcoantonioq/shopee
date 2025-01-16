import { app } from './src/infra/express.js'
import { fetchProductOffers } from './src/shopee/api/fetchProdctOffers.js'
import { saveProducts } from './src/shopee/products/productsSave.js'
import { state } from './state.js'

const start = async () => {
  app.listen(state.port, () =>
    console.log(`Servidor rodando em http://localhost:${state.port}`)
  )

  const products = await fetchProductOffers()

  try {
    await saveProducts(products)
  } catch (error) {
    console.log('Erro ao salvar: ', error)
  }
}
start()
