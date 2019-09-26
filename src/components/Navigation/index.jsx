import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DashboardIcon from '@material-ui/icons/Dashboard'
import ListAltIcon from '@material-ui/icons/ListAlt'
import PaymentIcon from '@material-ui/icons/Payment'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import ContactsIcon from '@material-ui/icons/Contacts'

import { StyledLink } from '../CommonStyled'

const Navigation = () => (
  <div>
    <StyledLink to="/">
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </StyledLink>
    <StyledLink to="/accounts">
      <ListItem button>
        <ListItemIcon>
          <ContactsIcon />
        </ListItemIcon>
        <ListItemText primary="Accounts" />
      </ListItem>
    </StyledLink>
    <StyledLink to="/transactions">
      <ListItem button>
        <ListItemIcon>
          <ListAltIcon />
        </ListItemIcon>
        <ListItemText primary="Transactions" />
      </ListItem>
    </StyledLink>
    <StyledLink to="/payments">
      <ListItem button>
        <ListItemIcon>
          <PaymentIcon />
        </ListItemIcon>
        <ListItemText primary="Make a payment" />
      </ListItem>
    </StyledLink>
    <StyledLink to="/authorizations">
      <ListItem button>
        <ListItemIcon>
          <AccountBalanceIcon />
        </ListItemIcon>
        <ListItemText primary="Authorizations" />
      </ListItem>
    </StyledLink>
  </div>
)

export default Navigation
