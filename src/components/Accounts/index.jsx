import qs from 'query-string'
import { Fragment, useContext } from 'react'
import NumberFormat from 'react-number-format'

import { AppContext } from '../../App'
import { getLogo } from '../../constants/banks'
import calculateAccountNumber from '../../helpers/calculateAccountNumber'
import BankLabel from '../BankLabel'
import DataTable from '../DataTable'
import Image from '../Image'
import ListFilter from '../ListFilter'

const Accounts = ({ location }) => {
  const {
    services: { aisp, common },
  } = useContext(AppContext)

  const { bank } = qs.parse(location.search)

  return (
    <Fragment>
      <ListFilter
        inputs={[
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
        ]}
      />
      <DataTable
        query={{
          query: aisp.allAccounts,
          params: { bank },
        }}
        mapper={data => {
          return data.map(
            ({ id, currency, identification, servicer, balances }) => ({
              id,
              link: `/transactions?account=${id}&bank=${servicer.bankCode}`,
              /* eslint-disable react/jsx-key */
              fields: [
                calculateAccountNumber(identification.iban),
                identification.iban,
                <NumberFormat
                  value={balances ? balances[0].amount.value : null}
                  displayType="text"
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator
                />,
                currency,
                servicer.countryCode,
                <Image
                  src={getLogo(servicer.bankCode)}
                  alt={servicer.bankCode}
                  height={36}
                />,
              ],
            }),
          )
        }}
        headers={[
          { name: 'Account Number' },
          { name: 'IBAN', sortKey: 'iban' },
          { name: 'Amount' },
          { name: 'Currency', sortKey: 'currency' },
          { name: 'Country', sortKey: 'country' },
          { name: 'Bank' },
        ]}
      />
    </Fragment>
  )
}

export default Accounts
