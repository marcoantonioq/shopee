// @ts-nocheck
import express from 'express'
import { formatProduct } from '../utils.js'
import { fetchProductOffers } from '../shopee/fetchProdctOffers.js'
import { generateShortLink } from '../shopee/shortLink.js'
import { saveProducts } from '../google/saveProducts.js'

export const app = express()

app.use(express.json({ limit: '1gb' }))

app.get('/produtos', async (req, res) => {
  const products = await fetchProductOffers(1)
  if (!products || products.length === 0) {
    const error = 'Nenhum produto encontrado.'
    console.error(error)
    res.status(400).json({ success: false, errors: [error] })
    return
  }

  const data = products.map(formatProduct)
  res.status(200).json({ success: false, data, errors: [] })

  try {
    await saveProducts(data)
  } catch (error) {
    console.log('Erro ao salvar: ', error)
  }
})

app.post('/link', async (req, res) => {
  const result = { success: false, data: { msg: '' }, errors: [] }
  try {
    const { productId, link } = req.body
    if (!(productId || link)) {
      return res.status(400).json({
        success: false,
        data: null,
        errors: ['Product ID is required'],
      })
    }

    if (link) {
      const shortLink = await generateShortLink(link, [
        'WhatsappMarco',
        'Capilar',
        'Beleza',
      ])

      result.data.msg = `Quero: ${shortLink}`

      console.log('Obtido link: ', shortLink)
    }
  } catch (error) {
    console.log('Erro ao obter link: ', error)
  }

  res.status(200).json(result)
})
