import axios from 'axios'
import { generateShortLink } from '../api/generateShortLink.js'
import { marketingMessages } from './marketingMessages.js'

const fetchImageAsBase64 = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    })
    const base64 = Buffer.from(response.data, 'binary').toString('base64')
    const mimeType = response.headers['content-type']
    return `data:${mimeType};base64,${base64}`
  } catch (error) {
    console.error('Erro ao buscar a imagem:', error)
    throw error
  }
}

const analyzeProductName = (productName) => {
  if (productName.toLowerCase().includes('smartphone')) {
    return 'OFERTA ESPECIAL PARA SMARTPHONES! 📱'
  } else if (productName.toLowerCase().includes('tv')) {
    return 'DESCONTO EXCLUSIVO EM TVs! 📺'
  } else if (productName.toLowerCase().includes('notebook')) {
    return 'PROMOÇÃO IMPERDÍVEL EM NOTEBOOKS! 💻'
  } else if (productName.toLowerCase().includes('sapato')) {
    return 'OFERTA ESPECIAL EM SAPATOS! 👟'
  } else {
    return marketingMessages[
      Math.floor(Math.random() * marketingMessages.length)
    ]
  }
}

const generateCaption = (product) => {
  const { productName, price, priceDiscountRate, shortUrl } = product
  const originalPrice = price / (1 - priceDiscountRate / 100)
  const discountText =
    priceDiscountRate < 40
      ? '🔥BAIXOOOOOU🔥'
      : `${priceDiscountRate}% 🔥 DESCONTAÇO IMPERDÍVEL! 🤯`
  const formattedPrice = price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  const formattedOriginalPrice = originalPrice.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  const marketingMessage = analyzeProductName(productName)

  const priceInfo =
    priceDiscountRate > 40
      ? `💸 De ~${formattedOriginalPrice}~ por *${formattedPrice}*`
      : `💸 *${formattedPrice}*`

  return `${discountText}
🛍️ *${productName}*

${priceInfo}
${marketingMessage}

👉 *Comprar*: ${shortUrl}

> Promoção sujeita a alteração a qualquer momento
  `
}

export const adGenerator = async (product) => {
  try {
    const imageBase64 = await fetchImageAsBase64(product.imageUrl)
    const shortUrl = await generateShortLink(product.productLink, [
      'WhatsappMarco',
      'GeradorWhatsapp',
    ])
    const caption = generateCaption({
      ...product,
      shortUrl,
    })

    const ad = {
      ...product,
      image: imageBase64,
      url: shortUrl,
      caption,
    }
    return ad
  } catch (error) {
    console.error('Erro ao gerar o anúncio:', error)
    throw error
  }
}
