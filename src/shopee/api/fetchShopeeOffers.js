import { createGraphQLClient, generateAuthorizationHeader } from './config.js'
import { gql } from 'graphql-request'

export const fetchShopeeOffers = async ({
  keyword = '',
  sortType = 1,
  page = 1,
  limit = 10,
}) => {
  const query = gql`
    query ($keyword: String, $sortType: Int, $page: Int, $limit: Int) {
      shopeeOfferV2(
        keyword: $keyword
        sortType: $sortType
        page: $page
        limit: $limit
      ) {
        nodes {
          commissionRate
          imageUrl
          offerLink
          originalLink
          offerName
          offerType
          categoryId
          collectionId
          periodStartTime
          periodEndTime
        }
        pageInfo {
          page
          limit
          hasNextPage
        }
      }
    }
  `

  const variables = { keyword, sortType, page, limit }
  const payload = JSON.stringify({ query, variables })
  const authorization = generateAuthorizationHeader(payload)
  const client = createGraphQLClient(authorization)

  try {
    const data = await client.request(query, variables)
    return data.shopeeOfferV2
  } catch (error) {
    console.error(
      'Erro ao buscar ofertas:',
      error.response?.errors || error.message
    )
    throw new Error('Não foi possível buscar as ofertas.')
  }
}

export const fetchAllShopeeOffers = async ({
  keyword = '',
  sortType = 1,
  limit = 10,
}) => {
  let page = 1
  let hasNextPage = true
  const allOffers = []

  while (hasNextPage) {
    try {
      const { nodes, pageInfo } = await fetchShopeeOffers({
        keyword,
        sortType,
        page,
        limit,
      })
      console.log('Page info: ', pageInfo)

      allOffers.push(...nodes)
      hasNextPage = pageInfo.hasNextPage
      page = pageInfo.page + 1
    } catch (error) {
      console.error('Erro durante a iteração de páginas:', error.message)
      throw new Error('Não foi possível completar a busca de todas as ofertas.')
    }
  }

  return allOffers
}
