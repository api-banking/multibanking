import { Checkbox, FormControl, MenuItem, TextField } from '@material-ui/core'
import { InlineDatePicker } from 'material-ui-pickers'
import { useEffect, useState } from 'react'

import useDebounce from '../../CustomHooks/useDebounce'
import Query from '../Query'

const getSelectItems = (items, name) => {
  return items.map(item => (
    <MenuItem value={item.value} key={`${name}-${item.key || item.value}`}>
      {item.title}
    </MenuItem>
  ))
}

const Field = ({ field, handleChange, value, errors, queryParam, style }) => {
  const type = field.type || 'text'
  const inputKey = `form-${field.name}`
  const errorMessage = errors && errors[0]

  const [fieldValue, setFieldValue] = useState(value)
  const debouncedFieldValue = useDebounce(fieldValue, 500)

  useEffect(() => {
    if (field.debounce) {
      handleChange(field.name, debouncedFieldValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFieldValue])

  const innerHandleChange = inputValue => {
    setFieldValue(inputValue)
    if (!field.debounce) {
      handleChange(field.name, inputValue)
    }
  }

  const commonStyle = { width: '100%', marginBottom: 20, ...style }
  const commonProps = {
    value: fieldValue,
    onChange: event => innerHandleChange(event.target.value),
    onBlur: event => innerHandleChange(event.target.value),
    disabled: field.disabled || false,
    label: field.title,
    key: inputKey,
    // underlineFocusStyle,
    // floatingLabelFocusStyle,
    name: field.name,
    error: Boolean(errorMessage),
    helperText: errorMessage,
  }

  switch (type) {
    case 'text':
      return (
        <TextField style={{ width: '100%', ...commonStyle }} {...commonProps} />
      )
    case 'password':
      return (
        <TextField
          type="password"
          style={{ width: '100%', ...commonStyle }}
          {...commonProps}
        />
      )
    case 'multiLineText':
      return (
        <TextField
          multiline
          style={{ width: '100%', ...commonStyle }}
          {...commonProps}
        />
      )
    case 'number':
      return <TextField type="number" style={commonStyle} {...commonProps} />
    case 'select': {
      const selectProps = {
        select: true,
        SelectProps: {
          multiple: field.multiple || false,
        },
      }
      return (
        <FormControl style={commonStyle}>
          {field.query ? (
            <Query params={queryParam} {...field.query}>
              {data => (
                <TextField {...selectProps} {...commonProps}>
                  {field.empty && (
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                  )}
                  {data && getSelectItems(field.itemMapper(data), field.name)}
                </TextField>
              )}
            </Query>
          ) : (
            <TextField {...selectProps} {...commonProps}>
              {field.empty && <MenuItem value={null} primaryText="" />}
              {getSelectItems(field.items || [], field.name)}
            </TextField>
          )}
        </FormControl>
      )
    }
    case 'checkbox':
      return (
        <Checkbox
          {...commonProps}
          checked={value}
          onCheck={(event, isChecked) => innerHandleChange(isChecked)}
          style={commonStyle}
        />
      )
    case 'date':
      return (
        <InlineDatePicker
          {...commonProps}
          onlyCalendar
          clearable
          keyboard
          format="DD/MM/YYYY"
          onChange={innerHandleChange}
          style={commonStyle}
          mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
        />
      )

    default:
      console.error(`Unknown type: ${type}`)
      return null
  }
}

export default Field
