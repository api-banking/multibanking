import { CircularProgress } from '@material-ui/core'
import { Warning } from '@material-ui/icons'
import { useState } from 'react'

import useAsyncEffect from '../../helpers/useAsyncEffect'

const shallowEquals = (obj1, obj2) =>
  Object.keys(obj1).length === Object.keys(obj2).length &&
  Object.keys(obj1).every(key => obj1[key] === obj2[key])

const Query = ({
  children,
  query,
  params = {},
  silent,
  dataKey,
  defaultSort,
}) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [sort, setSort] = useState(null)
  const [order, setOrder] = useState()
  const [queryParams, setQueryParams] = useState(params)

  if (!shallowEquals(queryParams, params)) {
    setQueryParams(params)
  }

  const effect = async ignoreCache => {
    setLoading(true)
    setData(null)
    const loadedData = await query({ sort, order, ...queryParams }, ignoreCache)
    if (defaultSort) {
      defaultSort(dataKey ? loadedData[dataKey] : loadedData)
    }
    setData(loadedData)
    setLoading(false)
  }

  useAsyncEffect(effect, [sort, order, queryParams])

  const refetch = () => effect(true)

  if (!silent) {
    if (loading) {
      return <CircularProgress />
    }

    if (data instanceof Error) {
      return <Warning />
    }
  }

  return children(data && dataKey ? data[dataKey] : data, {
    loading,
    error: data instanceof Error,
    order,
    sort,
    setOrder,
    setSort,
    refetch,
  })
}

export default Query
