import { gql } from 'graphql-request'
import { createGraphQLClient, generateAuthorizationHeader } from './config.js'

export const generateShortLink = async (originUrl, subIds = []) => {
  const query = gql`
    mutation {
      generateShortLink(input: { originUrl: "${originUrl}", subIds: ${JSON.stringify(
    subIds
  )} }) {
        shortLink
      }
    }
  `

  const variables = { originUrl, subIds }
  const payload = JSON.stringify({ query, variables })
  const authorization = generateAuthorizationHeader(payload)
  const client = createGraphQLClient(authorization)

  try {
    const data = await client.request(query, variables)
    return data.generateShortLink.shortLink
  } catch (error) {
    console.error(
      'Erro ao gerar short link:',
      error.response?.errors || error.message
    )
    throw error
  }
}
