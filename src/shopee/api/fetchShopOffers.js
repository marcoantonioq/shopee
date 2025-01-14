import { createGraphQLClient, generateAuthorizationHeader } from './config.js'
import { gql } from 'graphql-request'

export const fetchShopOffers = async ({
  page = 1,
  limit = 10,
  shopId,
  keyword,
  isKeySeller,
  sortType = 1,
  sellerCommCoveRatio,
}) => {
  let hasNextPage = true
  const shopOffers = []

  const query = gql`
    query (
      $page: Int
      $limit: Int
      $shopId: Int64
      $keyword: String
      $isKeySeller: Boolean
      $sortType: Int
      $sellerCommCoveRatio: String
    ) {
      shopOfferV2(
        page: $page
        limit: $limit
        shopId: $shopId
        keyword: $keyword
        isKeySeller: $isKeySeller
        sortType: $sortType
        sellerCommCoveRatio: $sellerCommCoveRatio
      ) {
        nodes {
          commissionRate
          imageUrl
          offerLink
          originalLink
          shopId
          shopName
          ratingStar
          shopType
          remainingBudget
          periodStartTime
          periodEndTime
          sellerCommCoveRatio
          bannerInfo {
            count
            banners {
              fileName
              imageUrl
              imageSize
              imageWidth
              imageHeight
            }
          }
        }
        pageInfo {
          page
          limit
          hasNextPage
        }
      }
    }
  `

  while (hasNextPage) {
    const variables = {
      page,
      limit,
      shopId,
      keyword,
      isKeySeller,
      sortType,
      sellerCommCoveRatio,
    }
    const payload = JSON.stringify({ query, variables })
    const authorization = generateAuthorizationHeader(payload)
    const client = createGraphQLClient(authorization)

    try {
      const data = await client.request(query, variables)
      shopOffers.push(...data.shopOfferV2.nodes)

      const pageInfo = data.shopOfferV2.pageInfo
      hasNextPage = pageInfo.hasNextPage

      if (hasNextPage) page += 1
    } catch (error) {
      console.error(
        'Erro na requisição:',
        error.response?.errors || error.message
      )
      hasNextPage = false
    }
  }

  const formatTimestamp = (timestamp) =>
    timestamp ? new Date(Number(timestamp) * 1000).toISOString() : ''

  return shopOffers.map((offer) => ({
    ...offer,
    periodStartTime: formatTimestamp(offer.periodStartTime),
    periodEndTime: formatTimestamp(offer.periodEndTime),
    commissionRate: parseFloat(offer.commissionRate) || 0,
    sellerCommCoveRatio: parseFloat(offer.sellerCommCoveRatio) || 0,
  }))
}
