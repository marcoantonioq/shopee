import { GraphQLClient } from 'graphql-request'
import crypto from 'crypto'
import { state } from '../../state.js'

export function generateAuthorizationHeader(payload) {
  const timestamp = Math.floor(Date.now() / 1000)
  const signatureBase = `${state.shopee.config.id}${timestamp}${payload}${state.shopee.config.secret}`
  const signature = crypto
    .createHash('sha256')
    .update(signatureBase)
    .digest('hex')

  return `SHA256 Credential=${state.shopee.config.id}, Timestamp=${timestamp}, Signature=${signature}`
}

export function createGraphQLClient(authorization) {
  return new GraphQLClient(state.shopee.config.host, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization,
    },
  })
}
