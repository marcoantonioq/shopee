import { formatProduct } from '../../utils.js'
import { createGraphQLClient, generateAuthorizationHeader } from './config.js'
import { gql } from 'graphql-request'

export const fetchProductOffers = async (
  pagination = 0,
  sortType = 4,
  limit = 20,
  listType = 2
) => {
  let hasNextPage = true
  const products = []
  let page = pagination ? pagination : 1

  const query = gql`
    query ($page: Int, $sortType: Int, $limit: Int, $listType: Int) {
      productOfferV2(
        page: $page
        sortType: $sortType
        limit: $limit
        listType: $listType
      ) {
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
    const variables = { page, sortType, limit, listType }
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

  const formatValue = (value) => {
    if (typeof value === 'number' || !isNaN(value)) {
      return Number(value)
    }
    return value
  }

  return products
    .map((e) => {
      e = {
        ...e,
        periodStartTime: e.periodStartTime
          ? new Date(Number(e.periodStartTime) * 1000).toISOString()
          : '',
        periodEndTime: e.periodEndTime
          ? new Date(Number(e.periodEndTime) * 1000).toISOString()
          : '',
        commissionRate: formatValue(e.commissionRate),
        commission: formatValue(e.commission),
        price: formatValue(e.price),
        priceMin: formatValue(e.priceMin),
        priceMax: formatValue(e.priceMax),
        ratingStar: e.ratingStar ? Number(e.ratingStar) : null,
      }
      return e
    })
    .map(formatProduct)
}
