import { getRedirectedUrl } from '../../infra/redirectedUrl.js'
import { generateShortLink } from '../api/generateShortLink.js'

export const filterWords = (text) =>
  text
    .replace(/BUUUUUG/gi, 'BUUG')
    .replace(/SHARA/gi, 'NAYA')
    .trim()

export async function processShopeeOffer(text) {
  const urlPattern = /https?:\/\/[^\s]+/g
  const urls = text.match(urlPattern) || []
  let isOffer = false

  // Obter redirecionamentos em paralelo
  const redirections = await Promise.all(
    urls.map(async (url) => {
      const linkRedirect = await getRedirectedUrl(url)
      return { original: url, redirect: linkRedirect }
    })
  )

  // Filtrar URLs da Shopee e gerar short links em paralelo
  const shopeeUrls = redirections.filter(({ redirect }) =>
    redirect.includes('shopee')
  )
  const otherUrls = redirections.filter(
    ({ redirect }) => !redirect.includes('shopee')
  )

  const shortLinks = await Promise.all(
    shopeeUrls.map(({ redirect }) =>
      generateShortLink(redirect, ['Whatsapp', 'Marco'])
    )
  )

  // Substituir URLs da Shopee e remover outras URLs
  shopeeUrls.forEach(({ original }, index) => {
    text = text.replace(original, shortLinks[index])
  })

  otherUrls.forEach(({ original }) => {
    text = text.replace(original, '')
  })

  // Marcar como oferta se houver links da Shopee
  isOffer = shopeeUrls.length > 0

  return { replacedText: filterWords(text), isOffer }
}
