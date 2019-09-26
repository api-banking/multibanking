import { useContext } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import Cookies from 'universal-cookie'

import { AppContext } from '../../App'

const cookies = new Cookies()

const Logout = ({ location }) => {
  const { state, setState } = useContext(AppContext)

  setState({ ...state, user: { ...state.user, token: null } })

  cookies.remove('csas.multibanking.token')

  return (
    <Redirect
      to={{
        pathname: '/login',
        state: { from: location },
      }}
    />
  )
}

export default withRouter(Logout)
