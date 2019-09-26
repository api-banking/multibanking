import { useContext } from 'react'
import { Redirect, withRouter } from 'react-router-dom'

import { AppContext } from '../../App'

const Authorized = ({ location }) => {
  const { enqueueSnackbar } = useContext(AppContext)

  enqueueSnackbar('Successfully authorized!', { variant: 'success' })

  return (
    <Redirect
      to={{
        pathname: '/authorizations',
        state: { from: location },
      }}
    />
  )
}

export default withRouter(Authorized)
