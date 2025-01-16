import axios from 'axios'

export const getRedirectedUrl = async (shortLink, maxRedirects = 5) => {
  let currentLink = shortLink

  for (let attempt = 0; attempt < maxRedirects; attempt++) {
    try {
      const response = await axios.get(currentLink, { maxRedirects: 0 })
      if (response.status === 301 || response.status === 302) {
        currentLink = response.headers.location
      } else {
        break
      }
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 301 || error.response.status === 302)
      ) {
        currentLink = error.response.headers.location
      } else {
        console.error('Erro ao obter URL redirecionada:', error)
        break
      }
    }
  }

  return currentLink
}
