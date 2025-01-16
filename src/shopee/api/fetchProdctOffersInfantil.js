import { formatProduct } from '../../utils.js'
import { createGraphQLClient, generateAuthorizationHeader } from './config.js'
import { gql } from 'graphql-request'

export const fetchProductOffersInfantil = async (
  initialPage = 1,
  sortType = 4,
  listType = 2,
  maxPages = 4
) => {
  const products = []
  let page = initialPage

  const query = gql`
    query ($page: Int, $sortType: Int, $listType: Int) {
      productOfferV2(page: $page, sortType: $sortType, listType: $listType) {
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
          hasNextPage
        }
      }
    }
  `

  while (page <= maxPages) {
    try {
      const variables = { page, sortType, listType }
      const payload = JSON.stringify({ query, variables })
      const client = createGraphQLClient(generateAuthorizationHeader(payload))
      const {
        productOfferV2: { nodes = [], pageInfo },
      } = await client.request(query, variables)

      products.push(...nodes)
      if (!pageInfo.hasNextPage) break
      page++
      console.log('Page: ', { page, produtos: nodes.length, pageInfo })
    } catch (error) {
      console.error(`Erro na página ${page}:`, error.message)
      break
    }
  }

  const formatValue = (v) => (v && !isNaN(v) ? +v : v)

  return products.map((p) =>
    formatProduct({
      ...p,
      periodStartTime: p.periodStartTime
        ? new Date(p.periodStartTime * 1000).toISOString()
        : '',
      periodEndTime: p.periodEndTime
        ? new Date(p.periodEndTime * 1000).toISOString()
        : '',
      commissionRate: formatValue(p.commissionRate),
      commission: formatValue(p.commission),
      price: formatValue(p.price),
      priceMin: formatValue(p.priceMin),
      priceMax: formatValue(p.priceMax),
      ratingStar: p.ratingStar ? +p.ratingStar : null,
    })
  )
}
