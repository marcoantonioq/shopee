import { app } from './infra/express.js'
import { fetchProductOffers } from './shopee/api/fetchProdctOffers.js'
import { saveProducts } from './shopee/products/productsSave.js'
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
