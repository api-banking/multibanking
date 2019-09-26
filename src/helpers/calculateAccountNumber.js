const calculateAccountNumber = iban => {
  const bank = iban.substr(4, 4)
  const account = iban.substr(14, 10)
  return `${account}/${bank}`
}

export default calculateAccountNumber
