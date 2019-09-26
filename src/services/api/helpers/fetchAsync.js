async function fetchAsync(url, options) {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw Error(response)
  }
  return response.json()
}

export default fetchAsync
