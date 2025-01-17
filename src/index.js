import { app } from './infra/express.js'
import { state } from './state.js'

const start = async () => {
  app.listen(state.port, () =>
    console.log(`Servidor rodando em http://localhost:${state.port}`)
  )
}
start()
