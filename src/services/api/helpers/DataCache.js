class DataCache {
  constructor(fetchFunction, enqueueSnackbar, minutesToLive = 10) {
    this.enqueueSnackbar = enqueueSnackbar
    this.millisecondsToLive = minutesToLive * 60 * 1000
    this.fetchFunction = fetchFunction
    this.cache = null
    this.fetchDate = new Date(0)
  }

  isCacheExpired = () => {
    return (
      this.fetchDate.getTime() + this.millisecondsToLive < new Date().getTime()
    )
  }

  get = async () => {
    if (!this.cache || this.isCacheExpired()) {
      try {
        const data = await this.fetchFunction()
        this.cache = data
      } catch (error) {
        this.cache = error
        // this.enqueueSnackbar(`Failed to fetch. ${error.statusText}`, { variant: 'error' })
      }
      this.fetchDate = new Date()
    }
    return this.cache
  }

  resetCache = () => {
    this.fetchDate = new Date(0)
  }
}

export default DataCache
