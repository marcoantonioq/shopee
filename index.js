import { app } from './src/infra/express.js'

app.listen(3000, () => console.log(`Servidor rodando em http://localhost:3000`))
