import qs from 'query-string'
import { Fragment, memo, useContext, useState } from 'react'
import NumberFormat from 'react-number-format'
import { withRouter } from 'react-router-dom'
import moment from 'moment'

import { AppContext } from '../../App'
import { getLogo } from '../../constants/banks'
import calculateAccountNumber from '../../helpers/calculateAccountNumber'
import normalizeString from '../../helpers/normalizeString'
import BankLabel from '../BankLabel'
import DataTable from '../DataTable'
import Image from '../Image'
import ListFilter from '../ListFilter'
import Query from '../Query'

const Transactions = ({ location }) => {
  const {
    services: { aisp, common },
  } = useContext(AppContext)

  const [dataFilter, setDataFilter] = useState(null)

  const { account, bank } = qs.parse(location.search)

  return (
    <Fragment>
      <ListFilter
        inputs={[
          {
            name: 'filter',
            title: 'Filter transactions',
            type: 'text',
            debounce: true,
          },
          {
            name: 'bank',
            title: 'Bank',
            type: 'select',
            itemMapper: banks =>
              banks.map(({ code, shortName, logo }) => ({
                value: code,
                title: <BankLabel name={shortName} logo={logo} />,
              })),
            query: {
              query: common.authorizedBanks,
            },
            empty: true,
          },
          {
            name: 'account',
            title: 'Account',
            type: 'select',
            itemMapper: accounts =>
              accounts.map(({ id, identification, currency }) => ({
                value: id,
                title: `${calculateAccountNumber(
                  identification.iban,
                )} ${currency}`,
              })),
            dependsOn: 'bank',
            query: {
              query: aisp.accounts,
              params: { bank },
              dataKey: 'accounts',
            },
            empty: true,
          },
        ]}
        customHandler={(filter, name) => {
          const newFilter = { ...filter }
          if (name === 'bank') {
            delete newFilter.account
            return newFilter
          }
          if (name === 'filter') {
            setDataFilter(newFilter[name])
          }
          return newFilter
        }}
      />

      <Query query={aisp.accounts}>
        {({ accounts }) => (
          <DataTable
            filterKey={dataFilter}
            filter={({ fields }) => {
              if (!dataFilter) {
                return true
              }
              const serializedString = fields.reduce(
                (acc, field) => (typeof field === 'string' ? acc + field : acc),
                '',
              )
              const dataString = normalizeString(serializedString)
              const filterString = normalizeString(dataFilter)
              return dataString.includes(filterString)
            }}
            query={{
              query: account ? aisp.transactions : aisp.allTransactions,
              params: {
                bank,
                id: account,
              },
              dataKey: 'transactions',
              defaultSort: data =>
                data.sort(
                  (a, b) =>
                    Date.parse(b.bookingDate) - Date.parse(a.bookingDate),
                ),
            }}
            mapper={data =>
              data.map((transaction, index) => {
                const {
                  amount: { value, currency },
                  bookingDate: date,
                  detail: {
                    additionalTransactionInformation,
                    remittanceInformation,
                  },
                  bankCode,
                  entryReference,
                } = transaction
                const identification =
                  transaction.identification ||
                  accounts.find(acc => acc.id === account).identification
                return {
                  id:
                    entryReference ||
                    // XXX: index in id (key) is BAD!!! (added because in test data there were duplicate transactions)
                    `${value}${currency}${bankCode}${additionalTransactionInformation}${date}${index}`,
                  /* eslint-disable react/jsx-key */
                  fields: [
                    moment(date).format('YYYY/MM/DD HH:mm:ss'),
                    (remittanceInformation &&
                      remittanceInformation.unstructured) ||
                      additionalTransactionInformation ||
                      'N/A',
                    <NumberFormat
                      value={value}
                      displayType="text"
                      decimalScale={2}
                      fixedDecimalScale
                      thousandSeparator
                    />,
                    currency,
                    identification &&
                      calculateAccountNumber(identification.iban),
                    <Image
                      src={getLogo(bankCode || bank)}
                      alt={bankCode || bank}
                      height={36}
                    />,
                  ],
                }
              })
            }
            headers={[
              { name: 'Date', sortKey: 'booking_date' },
              { name: 'Details' },
              { name: 'Amount', sortKey: 'amount' },
              { name: 'Currency' },
              { name: 'Account number' },
              { name: 'Bank' },
            ]}
          />
        )}
      </Query>
    </Fragment>
  )
}

export default withRouter(memo(Transactions))
