import axios from 'axios'
import cors from 'cors'
import express from 'express'
import path from 'path'

import mockedTransactions from './assets/mocks/transactions'

const app = express()

const BASE_URL = 'http://production.baapi.cz/v1'
const API_KEY = 'demoBaapiKey'

const pipe = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  headers: { 'baapi-key': API_KEY },
})

app.use(express.static(path.join(__dirname, 'web')))

app.use(cors())

app.get('/healthz', (req, res) => {
  res.json({ ok: true })
})

app.get('/my/accounts', async (req, res) => {
  try {
    const response = await pipe.get('/providers/mockbank/accounts', {
      params: { userId: 'demoUser' },
    })
    const { bank } = req.query
    const filtered = response.data.items.filter(item =>
      bank ? item.servicer.bankCode === bank : true,
    )
    res.json({ accounts: filtered })
  } catch (error) {
    console.error(error)
  }
})

app.get('/my/accounts/:id/transactions', async (req, res) => {
  // Remove mocking code before real usage
  const mockedTrx = mockedTransactions[req.params.id]
  if (mockedTrx) {
    res.json(mockedTrx)
  } else {
    try {
      const response = await pipe.get(
        `/users/demoUser/accounts/${req.params.id}/transactions`,
        {
          params: {
            userId: 'demoUser',
            consolidatedDateFrom: '2019-01-01',
            consolidatedDateTo: '',
            status: 'BOOK',
          },
        },
      )
      res.json({ transactions: response.data.items })
    } catch (error) {
      console.error(error)
    }
  }
})

app.get('/my/accounts/:id/balance', async (req, res) => {
  try {
    const response = await pipe.get(
      `/providers/mockbank/accounts/${req.params.id}/balances`,
      {
        params: {
          userId: 'demoUser',
        },
      },
    )
    res.json({ balances: response.data.items })
  } catch (error) {
    console.error(error)
  }
})

app.get('/availableBanks', async (req, res) => {
  res.json(['6210', '0800', '3030'])
})

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web/index.html'))
})

app.listen(process.env.PORT || 8080)
