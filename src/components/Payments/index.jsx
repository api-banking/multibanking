import IBAN from 'iban'
import Moment from 'moment'
import { useContext, useState } from 'react'

import { AppContext } from '../../App'
import calculateAccountNumber from '../../helpers/calculateAccountNumber'
import FormBuilder from '../FormBuilder'
import PaymentOverview from '../PaymentOverview'

const Payments = () => {
  const {
    services: { common, aisp, pisp },
    enqueueSnackbar,
  } = useContext(AppContext)

  const [authURL, setAuthURL] = useState(null)
  const [paymentInfo, setPaymentInfo] = useState(null)

  // Federated auth URL
  if (authURL && paymentInfo) {
    return <PaymentOverview authURL={authURL} paymentInfo={paymentInfo} />
  }

  return (
    <FormBuilder
      formTitle="Make a payment"
      fields={[
        {
          name: 'bank',
          type: 'select',
          title: 'Select bank',
          itemMapper: banks =>
            banks.map(({ code, shortName }) => ({
              value: code,
              title: shortName,
            })),
          query: {
            query: common.authorizedBanks,
          },
        },
        {
          name: 'debtorAccount',
          type: 'select',
          title: 'Account',
          dependsOn: 'bank',
          itemMapper: accounts =>
            accounts.map(({ identification, currency }) => ({
              value: `${identification.iban};${currency}`,
              title: `${calculateAccountNumber(
                identification.iban,
              )} ${currency}`,
            })),
          query: {
            query: aisp.accounts,
            formParam: 'bank',
            dataKey: 'accounts',
          },
        },
        {
          name: 'amount.instructedAmount.value',
          type: 'number',
          title: 'Amount',
        },
        {
          name: 'amount.instructedAmount.currency',
          type: 'select',
          title: 'Currency',
          items: ['CZK', 'USD', 'EUR'].map(item => ({
            value: item,
            title: item,
          })),
        },
        {
          name: 'creditorAccount.identification.iban',
          type: 'text',
          title: 'Send to (IBAN)',
          validator: value => !IBAN.isValid(value) && 'IBAN not valid!',
        },
        {
          name: 'requestedExecutionDate',
          type: 'date',
          title: 'Execution date',
          default: Moment(),
        },
        {
          name: 'remittanceInformation.unstructured',
          type: 'multiLineText',
          title: 'Additional info',
        },
      ]}
      // values={{ currency: 'CZK' }} // default values
      // errors={{ amount: 'This field is required.' }}
      submitTitle="Pay"
      saveForm={async values => {
        const {
          amount: { instructedAmount },
          debtorAccount,
          creditorAccount,
          bank,
          requestedExecutionDate,
          remittanceInformation,
        } = values

        const [iban, currency] = debtorAccount.split(';')
        const balance = await pisp.balanceCheck(values.bank, {
          exchangeIdentification: '123456789', // TODO: generate some random id
          debtorAccount: {
            identification: {
              iban,
            },
            currency,
          },
          transactionDetails: {
            currency: instructedAmount.currency,
            totalAmount: instructedAmount.value,
          },
        })
        if (balance.response === 'APPR') {
          // create payment
          const {
            paymentIdentification: { instructionIdentification },
            signInfo: { signId },
          } = await pisp.createPayment(bank, {
            ...values,
            debtorAccount: { identification: { iban, currency } },
            requestedExecutionDate: requestedExecutionDate.format('YYYY-MM-DD'),
            paymentTypeInformation: {
              instructionPriority: 'NORM',
            },
          })
          /* FEDERATED AUTHORIZATION */
          const { signingUrl, signInfo } = await pisp.federatedAuthorization({
            paymentId: instructionIdentification,
            signId,
            bank,
          })

          if (signInfo.state === 'OPEN' || signInfo.state === 'UNKNOWN') {
            setPaymentInfo({
              amount: instructedAmount,
              bank,
              creditorAccount: creditorAccount.identification.iban,
              debtorAccount: iban,
              requestedExecutionDate,
              info: remittanceInformation.unstructured,
            })
            setAuthURL(signingUrl)
          } else {
            enqueueSnackbar('Failed to create payment', { variant: 'error' })
          }

          /* API AUTHORIZATION */
          // // XXX: this endpoint is optional for the banks, TODO: error handling
          // const {
          //   scenarios,
          //   signInfo: { state },
          // } = await pisp.authorizationDetails({ bank, signId })
          // if (state === 'OPEN') {
          //   await pisp.startAuthorization(
          //     { signId, bank },
          //     { authorizationType: scenarios[0] || 'NONE' },
          //   )
          //   // TODO: handle various authorization types (scenarios)
          //   enqueueSnackbar('Payment successful!', { variant: 'success' })
          // }
        }
      }}
    />
  )
}

export default Payments
