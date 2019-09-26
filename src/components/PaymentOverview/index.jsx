import { Button, Grid, Paper, Typography, withStyles } from '@material-ui/core'
import NumberFormat from 'react-number-format'

import calculateAccountNumber from '../../helpers/calculateAccountNumber'
import { StyledHref } from '../CommonStyled'

const styles = theme => ({
  bigContainer: {
    width: 700,
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
  dataRow: {
    marginBottom: 32,
  },
})

const PaymentOverview = ({ classes, authURL, paymentInfo }) => (
  <div className={classes.bigContainer}>
    <Paper className={classes.paper}>
      <Typography
        style={{
          textTransform: 'uppercase',
          marginBottom: 20,
          fontSize: 18,
        }}
        color="primary"
        gutterBottom
      >
        Payment overview
      </Typography>
      <Grid item container xs={12} className={classes.dataRow}>
        <Grid item xs={6}>
          <Typography
            style={{ textTransform: 'uppercase' }}
            color="secondary"
            gutterBottom
          >
            Amount
          </Typography>
          <Typography variant="h5" gutterBottom>
            <NumberFormat
              value={paymentInfo.amount.value}
              displayType="text"
              fixedDecimalScale
              thousandSeparator
            />{' '}
            {paymentInfo.amount.currency}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            style={{ textTransform: 'uppercase' }}
            color="secondary"
            gutterBottom
          >
            Total fees
          </Typography>
          <Typography variant="h5" gutterBottom>
            0 {paymentInfo.amount.currency}
          </Typography>
        </Grid>
      </Grid>
      <Grid item container xs={12} className={classes.dataRow}>
        <Grid item xs={6}>
          <Typography
            style={{ textTransform: 'uppercase' }}
            color="secondary"
            gutterBottom
          >
            From account
          </Typography>
          <Typography variant="h5" gutterBottom>
            {calculateAccountNumber(paymentInfo.debtorAccount)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            style={{ textTransform: 'uppercase' }}
            color="secondary"
            gutterBottom
          >
            To account
          </Typography>
          <Typography variant="h5" gutterBottom>
            {calculateAccountNumber(paymentInfo.creditorAccount)}
          </Typography>
        </Grid>
      </Grid>
      <Grid item container xs={12} className={classes.dataRow}>
        <Grid item xs={6}>
          <Typography
            style={{ textTransform: 'uppercase' }}
            color="secondary"
            gutterBottom
          >
            Execution date
          </Typography>
          <Typography variant="h5" gutterBottom>
            {paymentInfo.requestedExecutionDate.format('LL')}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            style={{ textTransform: 'uppercase' }}
            color="secondary"
            gutterBottom
          >
            Additional info
          </Typography>
          <Typography variant="h5" gutterBottom>
            {paymentInfo.info}
          </Typography>
        </Grid>
      </Grid>
      <Grid item container xs={12} style={{ marginTop: 24 }}>
        <StyledHref href={authURL} style={{ width: '100%' }}>
          <Button variant="contained" color="primary" style={{ width: '100%' }}>
            Authorize payment
          </Button>
        </StyledHref>
      </Grid>
    </Paper>
  </div>
)

export default withStyles(styles)(PaymentOverview)
