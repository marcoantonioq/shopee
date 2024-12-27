import dotenv from 'dotenv'

dotenv.config()

export const state = {
  google: {
    config: {
      credentials: process.env.GOOGLE_CREDENTIALS
        ? JSON.parse(process.env.GOOGLE_CREDENTIALS)
        : {},
      scopes: process.env.GOOGLE_SCOPES
        ? JSON.parse(process.env.GOOGLE_SCOPES)
        : [],
    },
  },
  shopee: {
    config: {
      host: process.env.shopeeHost || '',
      id: process.env.shopeeApiId || '',
      secret: process.env.shopeeApiSecret || '',
    },
  },
}
