import qs from 'query-string'
import { useContext } from 'react'
import { Redirect, withRouter } from 'react-router-dom'

import { AppContext } from '../../App'

const Federated = ({ location }) => {
  const {
    enqueueSnackbar,
    services: { pisp },
  } = useContext(AppContext)

  enqueueSnackbar('Payment successfully authorized!', { variant: 'success' })

  const { bank, paymentId } = qs.parse(location.search)

  pisp
    .status({ paymentId, bank })
    .then(status => console.info('Final payment status', status))

  return (
    <Redirect
      to={{
        pathname: '/payments',
        state: { from: location },
      }}
    />
  )
}

export default withRouter(Federated)
