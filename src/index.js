import { app } from './infra/express.js'
import { updateCoupons } from './shopee/products/cupom.js'
import { state } from './state.js'

const start = async () => {
  app.listen(state.port, () =>
    console.log(`Servidor rodando em http://localhost:${state.port}`)
  )

  updateCoupons()

  setInterval(() => {
    updateCoupons()
  }, 1000 * 60 * 5)
}
start()
