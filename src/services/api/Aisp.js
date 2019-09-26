import Common from './Common'

class Aisp extends Common {
  constructor(args) {
    super({ ...args, ENDPOINT_PREFIX: '/my' })
  }

  accounts = ({ bank, paging = {} }) =>
    this.get('/accounts', {
      bank,
      size: paging.size || 1000,
      page: paging.page || 0,
      ...paging,
    })

  // XXX: this probably should be moved somewhere else
  allAccounts = async params => {
    let bankCode
    let paging
    if (params) {
      ;({ bank: bankCode, paging } = params)
    }
    let accountsByBank = null
    if (bankCode) {
      accountsByBank = await this.accounts({ bank: bankCode, paging })
      if (accountsByBank instanceof Error) return accountsByBank
      accountsByBank = [accountsByBank]
    } else {
      const banks = await this.authorizedBanks()
      if (banks instanceof Error) return banks
      accountsByBank = await Promise.all(
        banks.map(bank => this.accounts({ bank: bank.code, paging })),
      )
    }
    if (!accountsByBank) return null
    const reducedAccounts = accountsByBank.reduce(
      (acc, bankAccounts) =>
        bankAccounts &&
        !(bankAccounts instanceof Error) &&
        bankAccounts.accounts
          ? acc.concat(bankAccounts.accounts)
          : acc,
      [],
    )
    const error = accountsByBank.find(account => account instanceof Error)
    if (reducedAccounts.length === 0 && error) {
      return error
    }
    // add balances to each account
    const accountBalances = await Promise.all(
      reducedAccounts.map(account =>
        this.balance({
          id: account.id,
          currency: account.currency,
          bank: account.servicer.bankCode,
        }),
      ),
    )
    return reducedAccounts.map((account, index) => ({
      ...account,
      balances: accountBalances[index].balances,
    }))
  }

  balance = ({ id, bank, currency, ...params }) =>
    this.get(`/accounts/${id}/balance`, {
      bank,
      currency,
      ...params,
    })

  transactions = ({ id, bank, ...params }) =>
    this.get(`/accounts/${id}/transactions`, {
      bank,
      size: params.size || 1000,
      page: params.page || 0,
      ...params, // currency, fromDate, toDate
    })

  transactionsByAccount = async params => {
    const accounts = await this.allAccounts({ bank: params.bank })
    if (accounts instanceof Error) return accounts
    const transactionsByAccount = await Promise.all(
      accounts.map(({ id, servicer: { bankCode: bank } }) =>
        this.transactions({ id, bank, ...params }),
      ),
    )
    return accounts.map((acc, index) => ({
      ...acc,
      transactions: transactionsByAccount[index].transactions,
    }))
  }

  allTransactions = async params => {
    const accounts = await this.allAccounts({ bank: params.bank })
    if (accounts instanceof Error) return accounts
    const transactionsByAccount = await Promise.all(
      accounts.map(({ id, servicer: { bankCode: bank } }) =>
        this.transactions({ ...params, id, bank }),
      ),
    )
    /* eslint-disable indent */
    return {
      transactions: transactionsByAccount.reduce(
        (acc, accountTransactions, index) =>
          accountTransactions && accountTransactions.transactions
            ? acc.concat(
                accountTransactions.transactions.map(item => ({
                  ...item,
                  bankCode: accounts[index].servicer.bankCode,
                  identification: accounts[index].identification,
                })),
              )
            : acc,
        [],
      ),
    }
  }

  totalBalance = async () => {
    const totalBalance = []
    const accounts = await this.allAccounts({})

    if (!accounts) return null

    accounts.forEach(account => {
      account.balances.forEach(balance => {
        if (!totalBalance[balance.amount.currency]) {
          totalBalance[balance.amount.currency] = 0
        }
        totalBalance[balance.amount.currency] += balance.amount.value
      })
    })
    // console.log(totalBalance)
    return totalBalance
  }
}

export default Aisp
