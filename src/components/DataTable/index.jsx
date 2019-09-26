/* eslint-disable react-hooks/rules-of-hooks */
import {
  CircularProgress,
  Grid,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { Warning } from '@material-ui/icons'
import { useEffect, useState } from 'react'

import { StyledLink } from '../CommonStyled'
import Query from '../Query'

const styles = {
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  spinnerContainer: {
    height: '100%',
  },
}

// TODO: add default mapper
const DataTable = ({
  classes,
  headers,
  mapper,
  setSort,
  sort,
  order,
  setOrder,
  query,
  filter,
  filterKey,
}) => (
  <Paper className={classes.root}>
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          {headers.map(({ name, sortKey }, index) => (
            <TableCell
              align={index === 0 ? 'left' : 'right'}
              key={name}
              padding="default"
              sortDirection={sort === sortKey && order}
            >
              <Tooltip title="Sort" placement="bottom-end" enterDelay={300}>
                <TableSortLabel
                  active={sortKey && sort === sortKey}
                  direction={order}
                  onClick={() => {
                    if (sortKey) {
                      let newOrder = 'desc'
                      if (order === 'desc') newOrder = 'asc'
                      setOrder(newOrder)
                      setSort(sortKey)
                    }
                  }}
                >
                  {name}
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {query && (
          <Query {...query} silent>
            {(data, { loading, error }) => {
              const emptyResponse =
                (!data || !data.length) && !error && !loading
              const ready = !loading && !error && !emptyResponse && data

              const [tableData, setTableData] = useState(null)
              useEffect(() => {
                if (ready) {
                  let preparedData = mapper(data)
                  if (filter) {
                    preparedData = preparedData.filter(filter)
                  }
                  setTableData(preparedData)
                } else {
                  setTableData(null)
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
              }, [data, ready, filterKey])

              if (!ready || !tableData) {
                return (
                  <TableRow>
                    <TableCell colSpan="100%" height={100}>
                      <Grid
                        container
                        justify="center"
                        alignItems="center"
                        className={classes.spinnerContainer}
                      >
                        {error && <Warning />}
                        {loading && <CircularProgress />}
                        {emptyResponse && (
                          <Typography
                            component="h4"
                            variant="h6"
                            color="inherit"
                            className={classes.title}
                            noWrap
                          >
                            No data
                          </Typography>
                        )}
                      </Grid>
                    </TableCell>
                  </TableRow>
                )
              }

              return tableData.map(({ fields, link, id }) => (
                <TableRow
                  component={link ? StyledLink : 'tr'}
                  to={link}
                  key={id}
                >
                  {fields.map((value, itemIndex) => (
                    <TableCell
                      align={itemIndex === 0 ? 'left' : 'right'}
                      key={itemIndex} // eslint-disable-line react/no-array-index-key
                    >
                      {value}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            }}
          </Query>
        )}
      </TableBody>
    </Table>
  </Paper>
)

export default withStyles(styles)(DataTable)
