import { banks } from '../../constants/banks'
import ApiBase from './ApiBase'

class Common extends ApiBase {
  constructor(args) {
    super({ API_KEY: process.env.API_KEY, ...args })
  }

  clearCache = () => {
    this.dataCache = []
  }

  availableBanks = async () => {
    const availableBanks = await this.get('/availableBanks', {}, true)
    return availableBanks.map(bankCode => banks[bankCode])
  }

  isAuthorized = async ({ bank }, ignoreCache) => {
    const response = await this.get(
      '/my/accounts',
      { bank },
      true,
      {},
      ignoreCache,
    )
    // TODO: check for 403 specifically
    if (response instanceof Error) {
      return false
    }
    return true
  }

  authorizedBanks = async (queryParams, ignoreCache) => {
    const allBanks = await this.availableBanks()
    const bankResponses = await Promise.all(
      allBanks.map(({ code }) => {
        return this.isAuthorized({ bank: code }, ignoreCache)
      }),
    )
    return bankResponses.reduce((authorizedBanks, response, index) => {
      if (!response) {
        return authorizedBanks
      }
      return [...authorizedBanks, allBanks[index]]
    }, [])
  }
}

export default Common
