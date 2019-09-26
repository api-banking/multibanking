import '@babel/polyfill'
import 'react-hot-loader'
import 'typeface-roboto'

import MomentUtils from '@date-io/moment'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core'
import { blue, indigo } from '@material-ui/core/colors'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import { SnackbarProvider } from 'notistack'
import { createContext } from 'react'
import { hot } from 'react-hot-loader/root'

import AppContent from './components/AppContent'

export const AppContext = createContext('auth')

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: blue[900],
    },
    primary: {
      main: indigo[700],
    },
  },
  typography: {
    useNextVariants: true,
    // Use the system font instead of the default Roboto font.
    fontFamily: ['"Lato"', 'sans-serif'].join(','),
  },
})

const App = () => (
  <SnackbarProvider maxSnack={3}>
    <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <AppContent />
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  </SnackbarProvider>
)

export default hot(App)
