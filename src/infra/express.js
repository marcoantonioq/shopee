// @ts-nocheck
import express from 'express'
import { formatProduct } from '../utils.js'
import { generateShortLink } from '../shopee/shortLink.js'
import { productAdvertised } from '../shopee/products/productAdvertised.js'
import { fetchProductOffers } from '../shopee/fetchProdctOffers.js'
import { readProducts } from '../shopee/products/productsRead.js'
import { saveProducts } from '../shopee/products/productsSave.js'

export const app = express()

app.use(express.json({ limit: '1gb' }))

app.get('/reload-produtos', async (req, res) => {
  const products = await fetchProductOffers(1)
  if (!products || products.length === 0) {
    const error = 'Nenhum produto encontrado.'
    console.error(error)
    res.status(400).json({ success: false, errors: [error] })
    return
  }

  res.status(200).json({ success: false, data: products, errors: [] })

  try {
    await saveProducts(products)
  } catch (error) {
    console.log('Erro ao salvar: ', error)
  }
})

app.get('/produtos', async (req, res) => {
  const data = await readProducts()
  res.status(200).json({ success: false, data, errors: [] })
})

app.get('/advertised', async (req, res) => {
  const limit = parseInt(req.query.limit) || 1
  const data = await readProducts()
  const advertised = await productAdvertised(data, limit)
  res.status(200).json({ success: false, data: advertised, errors: [] })
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
