import qs from 'query-string'
import { memo, useState } from 'react'
import { withRouter } from 'react-router-dom'

import Field from '../Field'

const ListFilter = ({ inputs, location, history, customHandler }) => {
  const queryParams = qs.parse(location.search)

  const [filter, setFilter] = useState({ ...queryParams })

  const handleFilter = (name, value) => {
    let newFilter = { ...filter }
    if (value) {
      newFilter[name] = value
    } else {
      delete newFilter[name]
    }
    if (customHandler) {
      newFilter = customHandler(newFilter, name)
    }
    setFilter(newFilter)
    // write to URL
    history.push({
      pathname: location.pathname,
      search: qs.stringify(newFilter),
    })
  }

  return (
    <form autoComplete="off">
      {inputs &&
        inputs.map(
          field =>
            (!field.dependsOn || filter[field.dependsOn]) && (
              <Field
                key={`form-field-container-${field.name}`}
                field={field}
                handleChange={handleFilter}
                value={filter[field.name] || ''}
                style={{
                  minWidth: 200,
                  marginBottom: 20,
                  marginRight: 20,
                  width: 'initial',
                }}
              />
            ),
        )}
    </form>
  )
}

export default withRouter(memo(ListFilter))
