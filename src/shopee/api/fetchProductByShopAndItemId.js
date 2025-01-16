import { gql } from 'graphql-request'
import { createGraphQLClient, generateAuthorizationHeader } from './config.js'
import { formatProduct } from '../../utils.js'
import { getRedirectedUrl } from '../../infra/redirectedUrl.js'

export const extractShopAndItemId = async (link) => {
  const matchPatterns = [
    /https:\/\/shopee\.com\.br\/product\/(\d+)\/(\d+)/,
    /i\.(\d+)\.(\d+)/,
  ]

  for (const pattern of matchPatterns) {
    const match = link.match(pattern)
    if (match) return { shopId: match[1], itemId: match[2] }
  }

  const linkRedirect = await getRedirectedUrl(link)
  const matchRedirect = linkRedirect.match(
    /https:\/\/shopee\.com\.br\/product\/(\d+)\/(\d+)/
  )
  if (matchRedirect)
    return { shopId: matchRedirect[1], itemId: matchRedirect[2] }

  return null
}

export const fetchProductByShopAndItemId = async (shopId, itemId) => {
  const query = gql`
    query ($shopId: Int64, $itemId: Int64) {
      productOfferV2(shopId: $shopId, itemId: $itemId) {
        nodes {
          productName
          itemId
          commissionRate
          commission
          price
          sales
          imageUrl
          shopName
          productLink
          offerLink
          periodStartTime
          periodEndTime
          priceMin
          priceMax
          productCatIds
          ratingStar
          priceDiscountRate
          shopId
          shopType
          sellerCommissionRate
          shopeeCommissionRate
        }
      }
    }
  `

  const variables = { shopId, itemId }
  const payload = JSON.stringify({ query, variables })
  const authorization = generateAuthorizationHeader(payload)

  const client = createGraphQLClient(authorization)

  try {
    const data = await client.request(query, variables)
    const product = data.productOfferV2.nodes[0] // Assuming we get one product based on shopId and itemId

    if (!product) {
      throw new Error('Produto não encontrado')
    }

    const formatValue = (value) => {
      if (typeof value === 'number' || !isNaN(value)) {
        return Number(value)
      }
      return value
    }

    const formattedProduct = {
      ...product,
      periodStartTime: product.periodStartTime
        ? new Date(Number(product.periodStartTime) * 1000).toISOString()
        : '',
      periodEndTime: product.periodEndTime
        ? new Date(Number(product.periodEndTime) * 1000).toISOString()
        : '',
      commissionRate: formatValue(product.commissionRate),
      commission: formatValue(product.commission),
      price: formatValue(product.price),
      priceMin: formatValue(product.priceMin),
      priceMax: formatValue(product.priceMax),
      ratingStar: product.ratingStar ? Number(product.ratingStar) : null,
    }

    return formatProduct(formattedProduct)
  } catch (error) {
    console.error(
      'Erro na requisição:',
      error.response?.errors || error.message
    )
    throw error
  }
}
