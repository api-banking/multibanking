import { withSnackbar } from 'notistack'
import { useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Cookies from 'universal-cookie'

import { AppContext } from '../../App'
import Aisp from '../../services/api/Aisp'
import Auth from '../../services/api/Auth'
import Common from '../../services/api/Common'
import Pisp from '../../services/api/Pisp'
import Accounts from '../Accounts'
import AuthorizationView from '../AuthorizationView'
import Authorized from '../Authorized'
import Federated from '../Federated'
import Login from '../Login'
import Logout from '../Logout'
import Overview from '../Overview'
import Payments from '../Payments'
import PrivateRoute from '../PrivateRoute'
import Transactions from '../Transactions'

const cookies = new Cookies()

const initialState = {
  user: {
    token: cookies.get('csas.multibanking.token') || null,
  },
}

const AppContent = ({ enqueueSnackbar }) => {
  const [state, setState] = useState(initialState)
  const { token } = state.user

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        services: {
          aisp: new Aisp({ token, enqueueSnackbar }),
          pisp: new Pisp({ token, enqueueSnackbar }),
          auth: new Auth({ token, enqueueSnackbar }),
          common: new Common({ token, enqueueSnackbar }),
        },
        enqueueSnackbar,
      }}
    >
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <PrivateRoute exact path="/" title="Dashboard" component={Overview} />
          <PrivateRoute path="/authorized" component={Authorized} />
          <PrivateRoute path="/federated" component={Federated} />
          <PrivateRoute
            path="/accounts"
            title="Accounts"
            component={Accounts}
          />
          <PrivateRoute
            path="/transactions"
            title="Transactions"
            component={Transactions}
          />
          <PrivateRoute
            path="/payments"
            title="Payments"
            component={Payments}
          />
          <PrivateRoute
            path="/authorizations"
            title="Authorizations"
            component={AuthorizationView}
          />
        </Switch>
      </Router>
    </AppContext.Provider>
  )
}

export default withSnackbar(AppContent)
