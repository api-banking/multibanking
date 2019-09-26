import qs from 'query-string'

import DataCache from './helpers/DataCache'
import fetchAsync from './helpers/fetchAsync'

class ApiBase {
  constructor({ token, enqueueSnackbar, ENDPOINT_PREFIX, API_KEY }) {
    this.BASE_URL = ''
    if (process.env.BASE_URL) {
      this.BASE_URL = process.env.BASE_URL + ':' + (process.env.PORT || '8080')
    }
    this.ENDPOINT_PREFIX = ENDPOINT_PREFIX
    this.enqueueSnackbar = enqueueSnackbar
    // headers
    this.defaultHeaders = {}
    if (API_KEY) {
      this.defaultHeaders['baapi-key'] = API_KEY
    }
    if (token) {
      this.defaultHeaders.Authorization = `Bearer ${token}`
    }
    this.dataCache = []
  }

  get(endpoint, queryParams, ignorePrefix, options, refetch) {
    return this.fetch(
      endpoint,
      queryParams,
      { method: 'GET', ...options },
      ignorePrefix,
      refetch,
    )
  }

  post(endpoint, queryParams, data = {}, ignorePrefix, refetch = true) {
    return this.fetch(endpoint, queryParams, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      ignorePrefix,
      refetch,
    })
  }

  delete(endpoint, queryParams, ignorePrefix, refetch = true) {
    return this.fetch(endpoint, queryParams, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      ignorePrefix,
      refetch,
    })
  }

  async fetch(endpoint, queryParams, options = {}, ignorePrefix, refetch) {
    // assemble URL
    let URL = this.BASE_URL
    if (this.ENDPOINT_PREFIX && !ignorePrefix) {
      URL += this.ENDPOINT_PREFIX
    }
    URL += endpoint
    if (queryParams) {
      URL += `?${qs.stringify(queryParams)}`
    }
    const fetchCall = () =>
      fetchAsync(URL, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      })
    if (!this.dataCache[URL]) {
      this.dataCache[URL] = new DataCache(fetchCall, this.enqueueSnackbar)
    }
    if (refetch) {
      this.dataCache[URL].resetCache()
    }
    const data = await this.dataCache[URL].get()
    return data
  }
}

export default ApiBase
