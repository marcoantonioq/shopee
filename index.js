import { app } from './src/infra/express.js'
import { state } from './state.js'

app.listen(state.port, () =>
  console.log(`Servidor rodando em http://localhost:${state.port}`)
)
