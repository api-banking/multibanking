import Avatar from '@material-ui/core/Avatar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Paper from '@material-ui/core/Paper'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { useCallback, useContext } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import Cookies from 'universal-cookie'

import { AppContext } from '../../App'
import { logo } from '../../assets/images'
import LinkButton from '../LinkButton'
import { Logo } from './styled'

const cookies = new Cookies()

const redirectHome = location => (
  <Redirect
    to={{
      pathname: '/',
      state: { from: location },
    }}
  />
)

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: 'rgb(225, 0, 80)',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
})

const Login = ({ location, classes }) => {
  const { state, setState } = useContext(AppContext)

  const setToken = useCallback(
    token => {
      setState({ ...state, user: { ...state.user, token } })
      cookies.set('csas.multibanking.token', token, {
        maxAge: 999999999999,
      })
      return redirectHome(location)
    },
    [location, setState, state],
  )

  if (!state) return null

  if (state && state.user.token) {
    return redirectHome(location)
  }

  return (
    <main className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <Logo src={logo} width={300} alt="logo" />
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <div className={classes.form}>
          <LinkButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => setToken('xyz')}
          >
            Sign in
          </LinkButton>
        </div>
      </Paper>
    </main>
  )
}

export default withStyles(styles)(withRouter(Login))
