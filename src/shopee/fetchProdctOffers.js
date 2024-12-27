import { createGraphQLClient, generateAuthorizationHeader } from './config.js'
import { gql } from 'graphql-request'

export const fetchProductOffers = async (
  pagination = 0,
  sortType = 2,
  limit = 20
) => {
  let hasNextPage = true
  const products = []
  let page = pagination ? pagination : 1

  const query = gql`
    query ($page: Int, $sortType: Int, $limit: Int) {
      productOfferV2(page: $page, sortType: $sortType, limit: $limit) {
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
        pageInfo {
          page
          limit
          hasNextPage
          scrollId
        }
      }
    }
  `

  while (hasNextPage) {
    const variables = { page, sortType, limit }
    const payload = JSON.stringify({ query, variables })
    const authorization = generateAuthorizationHeader(payload)

    const client = createGraphQLClient(authorization)

    try {
      const data = await client.request(query, variables)
      products.push(...data.productOfferV2.nodes)

      const pageInfo = data.productOfferV2.pageInfo
      hasNextPage = pageInfo.hasNextPage

      if (hasNextPage && pagination) {
        page += 1
      }
    } catch (error) {
      console.error(
        'Erro na requisição:',
        error.response?.errors || error.message
      )
      hasNextPage = false
    }
  }
  return products
}
