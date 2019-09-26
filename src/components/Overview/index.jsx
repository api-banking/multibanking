import { useContext } from 'react'

import { AppContext } from '../../App'
import AccountOverview from '../AccountOverview'
import TotalBalanceOverview from '../TotalBalanceOverview'

import Query from '../Query'
import { Container } from './styled'

const Overview = () => {
  const {
    services: { aisp },
  } = useContext(AppContext)

  return (
    <Container>
      <Query query={aisp.totalBalance}>
        {data => <TotalBalanceOverview totalBalance={data} />}
      </Query>

      <div style={{ display: 'flex', flexFlow: 'wrap row', width: '100%' }}>
        <Query
          query={aisp.transactionsByAccount}
          // params={{ sort: 'booking_date', order: 'asc' }}
        >
          {data =>
            data.map(
              account =>
                account.transactions && (
                  <AccountOverview key={account.id} account={account} />
                ),
            )
          }
        </Query>
      </div>
    </Container>
  )
}

export default Overview
