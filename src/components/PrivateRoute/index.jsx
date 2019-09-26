import { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'

import { AppContext } from '../../App'
import Layout from '../Layout'

const PrivateRoute = ({ component: Component, title, ...rest }) => {
  const { state } = useContext(AppContext)
  return (
    <Layout title={title}>
      <Route
        {...rest}
        render={props => {
          if (!state || !state.user.token) {
            return (
              <Redirect
                to={{
                  pathname: '/login',
                  state: { from: props.location },
                }}
              />
            )
          }
          return <Component {...props} />
        }}
      />
    </Layout>
  )
}

export default PrivateRoute
