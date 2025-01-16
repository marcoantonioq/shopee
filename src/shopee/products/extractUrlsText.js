export const extractUrlsText = async (text) => {
  return text.match(/(https?:\/\/[^\s]+)/g) || []
}
