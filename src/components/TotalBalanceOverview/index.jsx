import { Grid, Typography } from '@material-ui/core'
import CountUp from 'react-countup'

import Colors from '../../constants/colors'
import { StyledCard } from './styled'

const TotalBalanceOverview = ({ totalBalance }) => {
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Total balance
      </Typography>

      <Grid container spacing={3} style={{ flexGrow: 1 }}>
        {Object.keys(totalBalance).map(key => (
          <Grid item xs={6} key={key}>
            <StyledCard>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                style={{
                  marginBottom: 0,
                  color:
                    totalBalance[key] < 0
                      ? Colors.redNegative
                      : Colors.greenPositive,
                }}
              >
                <CountUp
                  end={totalBalance[key]}
                  suffix={` ${key}`}
                  separator=","
                  decimals={2}
                  decimal="."
                />
              </Typography>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default TotalBalanceOverview
