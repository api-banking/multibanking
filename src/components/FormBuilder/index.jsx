import { Button, Card, Typography } from '@material-ui/core'
import _ from 'lodash'
import { useEffect, useState } from 'react'

import Field from '../Field'

const defaultValidators = [value => !value && 'Empty field!']

const FormBuilder = ({
  onChange,
  fields,
  inputContainerStyle,
  formTitle,
  saveForm,
  submitTitle,
  actionContainerStyle,
  fieldContainerStyle,
}) => {
  const [values, setValues] = useState(() => {
    const initValues = {}
    fields.map(field => _.set(initValues, field.name, field.default || ''))
    return initValues
  })
  const [errors, setErrors] = useState({})
  const [validators, setValidators] = useState({})

  useEffect(() => {
    const validatorsHelper = {}
    fields.forEach(({ validator, name }) => {
      validatorsHelper[name] = [...defaultValidators, validator]
    })
    setValidators(validatorsHelper)
  }, [fields])

  const validate = (name, value) =>
    validators[name].reduce((errs, validator) => {
      const err = validator && validator(value)
      if (err) {
        return [...errs, err]
      }
      return errs
    }, [])

  const validateField = (name, value) => {
    const errorMessages = validate(name, value)
    if (errorMessages.length) {
      setErrors(currentErrors => ({ ...currentErrors, [name]: errorMessages }))
      return false
    }
    delete errors[name]
    setErrors(currentErrors => ({ ...currentErrors, [name]: undefined }))
    return true
  }

  const handleChange = (name, value) => {
    setValues(currentValues => {
      const newValues = { ...currentValues }
      _.set(newValues, name, value)
      if (onChange) {
        onChange(values)
      }
      return newValues
    })
    validateField(name, value)
  }

  const validateForm = () => {
    for (let i = 0; i < fields.length; i++) {
      const { name } = fields[i]
      if (!validateField(name, _.get(values, name))) {
        return false
      }
    }
    return true
  }

  return (
    <Card style={{ padding: 20, maxWidth: 600 }}>
      {formTitle && (
        <Typography
          style={{
            textTransform: 'uppercase',
            marginBottom: 10,
            fontSize: 18,
          }}
          color="primary"
          gutterBottom
        >
          {formTitle}
        </Typography>
      )}
      <form autoComplete="off">
        <div
          style={{
            overflow: 'auto',
            marginBottom: 10,
            ...fieldContainerStyle,
          }}
        >
          {fields.map(
            field =>
              (!field.dependsOn || values[field.dependsOn]) && (
                <div
                  key={`form-field-container-${field.name}`}
                  style={inputContainerStyle}
                >
                  <Field
                    field={field}
                    handleChange={handleChange}
                    value={_.get(values, field.name)}
                    errors={errors[field.name]}
                    queryParam={
                      field.query && field.query.formParam
                        ? {
                            [field.query.formParam]:
                              values[field.query.formParam],
                          }
                        : undefined
                    }
                  />
                </div>
              ),
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            ...actionContainerStyle,
          }}
        >
          {saveForm && (
            <Button
              variant="contained"
              color="primary"
              style={{ minWidth: 100 }}
              onClick={() => {
                if (validateForm()) {
                  saveForm(values)
                }
              }}
            >
              {submitTitle || 'Save'}
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}

export default FormBuilder
