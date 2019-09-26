import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core'
import { useState } from 'react'
import NumberFormat from 'react-number-format'
import moment from 'moment'

import { getLogo } from '../../constants/banks'
import calculateAccountNumber from '../../helpers/calculateAccountNumber'
import AccountBarChart from '../charts/AccountBarChart'
import AccountLineChart from '../charts/AccountLineChart'
import Image from '../Image'
import { StyledCard, TopBar, Wrap } from './styled'
import Colors from '../../constants/colors'

const agregateTransactionsByDate = transactions => {
  const result = {}
  transactions.forEach(({ bookingDate: date, amount: { value } }) => {
    if (!result[date]) {
      result[date] = {
        positive: 0,
        negative: 0,
        total: 0,
      }
    }
    result[date][value > 0 ? 'positive' : 'negative'] += value
    result[date].total += value
  }, {})

  return Object.entries(result).map(([date, vals]) => ({
    date: moment(date).format('YYYY/MM/DD'),
    ...vals,
  }))
}

const AccountOverview = ({
  account: {
    transactions,
    id,
    name,
    identification,
    balances,
    servicer: { bankCode },
  },
}) => {
  const [graph, setGraph] = useState('bar')

  return (
    <Wrap key={id}>
      <StyledCard>
        <TopBar>
          <div style={{ display: 'flex' }}>
            <Image src={getLogo(bankCode)} alt={bankCode} height={30} />
            <div style={{ marginLeft: '20px' }}>
              <Typography
                variant="h6"
                gutterBottom
                style={{
                  fontWeight: 'bold',
                  color:
                    balances[0].amount.value < 0
                      ? Colors.redNegative
                      : Colors.greenPositive,
                }}
              >
                <NumberFormat
                  value={balances[0].amount.value}
                  suffix={` ${balances[0].amount.currency}`}
                  displayType="text"
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator
                />
              </Typography>
              <Typography variant="body1" gutterBottom>
                {name}, {calculateAccountNumber(identification.iban)}
              </Typography>
            </div>
          </div>
          <FormControl
            style={{ minWidth: 100, marginBottom: 20, marginRight: 20 }}
          >
            <InputLabel htmlFor="graph">Graph type</InputLabel>
            <Select
              value={graph}
              onChange={event => setGraph(event.target.value)}
              inputProps={{
                name: 'graph',
                id: 'graph',
              }}
            >
              <MenuItem value="bar">Bar</MenuItem>
              <MenuItem value="line">Line</MenuItem>
            </Select>
          </FormControl>
        </TopBar>
        {graph === 'bar' && (
          <AccountBarChart data={agregateTransactionsByDate(transactions)} />
        )}
        {graph === 'line' && (
          <AccountLineChart data={agregateTransactionsByDate(transactions)} />
        )}
      </StyledCard>
    </Wrap>
  )
}

export default AccountOverview
