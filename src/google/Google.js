import { google as GoogleApis } from 'googleapis'

let client = null

export const auth = async (authConfig) => {
  const authentication = new GoogleApis.auth.GoogleAuth(authConfig)
  client = await authentication.getClient()
}

export const spreadsheets = () => {
  if (!client) throw new Error('Autenticação necessária')
  return GoogleApis.sheets({
    version: 'v4',
    auth: client,
  }).spreadsheets
}

export const people = () => {
  if (!client) throw new Error('Autenticação necessária')
  return GoogleApis.people({
    version: 'v1',
    auth: client,
  }).people
}

export const speech = () => {
  if (!client) throw new Error('Autenticação necessária')
  return GoogleApis.speech({
    version: 'v1',
    auth: client,
  }).speech
}

export const storage = () => {
  if (!client) throw new Error('Autenticação necessária')
  return GoogleApis.storage({ version: 'v1', auth: client })
}

// Para usar a autenticação inicial com credenciais fixas:
export const initialAuth = async () => {
  const initialCredentials = {
    credentials: {
      type: 'service_account',
      project_id: '',
      private_key_id: '',
      private_key: '',
      client_email: '',
      client_id: '',
      auth_uri: '',
      token_uri: '',
      auth_provider_x509_cert_url: '',
      client_x509_cert_url: '',
      universe_domain: 'googleapis.com',
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  }
  await auth(initialCredentials)
}
