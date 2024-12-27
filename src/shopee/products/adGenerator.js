import axios from 'axios'
import { generateShortLink } from '../shortLink.js'

export const adGenerator = async (p) => {
  const response = await axios.get(p.imageUrl, {
    responseType: 'arraybuffer',
  })
  const base64 = Buffer.from(response.data, 'binary').toString('base64')
  const mimeType = response.headers['content-type']
  p.image = `data:${mimeType};base64,${base64}`
  p.url = await generateShortLink(p.productLink, [
    'WhatsappMarco',
    'GeradorWhatsapp',
  ])
  p.caption = `${
    p.priceDiscountRate < 40
      ? '🔥BAIXOOOOOU🔥'
      : p.priceDiscountRate + '% 🔥 DESCONTAÇO IMPERDÍVEL! 🤯'
  }🔥
🛍️ ${p.productName}

💸por ${p.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })}

👉Comprar: ${p.url}
> Promoção sujeita a alteração a qualquer momento
  `
  console.log('Gerar: ', p)
  return p
}
