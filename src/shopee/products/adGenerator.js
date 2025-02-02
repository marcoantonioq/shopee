import axios from 'axios'
import { generateShortLink } from '../api/generateShortLink.js'
import { marketingMessages } from './marketingMessages.js'
import { cupom } from './cupom.js'

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

const getDiscountTitle = ({ product }) => {
  const { priceDiscountRate, productName } = product

  if (priceDiscountRate >= 70) {
    return `🚨 ${priceDiscountRate}% OFF! 😱\n✨ ${productName}`
  } else if (priceDiscountRate >= 50) {
    return `🔥 ${priceDiscountRate}% de desconto!\n🛍️ ${productName}`
  } else if (priceDiscountRate >= 30) {
    return `⭐ ${priceDiscountRate}% de desconto em ${productName}`
  }
  return `🛍️ ${productName}`
}

const generateCaption = (product) => {
  const { productName, price, priceDiscountRate, shortUrl } = product
  const originalPrice = price / (1 - priceDiscountRate / 100)

  const cupomDescont = cupom(product)

  // const newValue = cupomDescont?.discountValue
  //   ? price - cupomDescont?.discountValue || 0
  //   : price
  const newValue = price

  const variationValue = product.priceMin != product.priceMax ? '~' : ''

  const discountTitle = getDiscountTitle({ product })

  const formattedPrice = newValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const formattedOriginalPrice = originalPrice.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  const marketingMessage = analyzeProductName(productName)

  const priceInfo =
    priceDiscountRate > 30
      ? `~DE ${formattedOriginalPrice}~ ❌\nPOR ${variationValue}*${formattedPrice}* 🔥`
      : `💸 ${variationValue}*${formattedPrice}*`

  return `${discountTitle}

${priceInfo}
${marketingMessage}

*COMPRAR* 🛒👇🏻
${shortUrl}
> Promoção sujeita a alteração a qualquer momento`
  // ${cupomDescont ? '\n' + cupomDescont.description + '\n' : ''}
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
