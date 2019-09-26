import Common from './Common'

class Pisp extends Common {
  constructor(args) {
    super({ ...args, ENDPOINT_PREFIX: '/my' })
  }

  federatedAuthCallbackUrl = `http://${window.location.host}/federated`

  /**
   * Account balance check
   * @param {string} bank
   * @param {object} params - debtorAccount*, transactionDetails*, card, merchant
   */
  balanceCheck = (bank, data) =>
    this.post(
      '/payments/balanceCheck',
      {
        bank,
      },
      data,
    )

  createPayment = (bank, data) =>
    this.post(
      '/payments',
      {
        bank,
      },
      data,
    )

  status = ({ paymentId, bank }) =>
    this.get(`/payments/${paymentId}/status`, { bank })

  authorizationDetails = ({ signId, bank }) =>
    this.get(`/payments/sign/${signId}`, { bank })

  startAuthorization = ({ signId, bank }, data) =>
    this.post(`/payments/sign/${signId}`, { bank }, data)

  federatedAuthorization = ({ signId, paymentId, bank }) =>
    this.get(
      `/payments/${paymentId}/federate/sign/${signId}`,
      { bank },
      false,
      {
        headers: {
          'Callback-Uri': `${
            this.federatedAuthCallbackUrl
          }?paymentId=${signId}&bank=${bank}`,
        },
      },
    )

  // XXX: DEPRECATED, DO NOT USE
  pollAuthorizationState = ({ pollId, bank }) =>
    this.get(`/payments/sign/poll/${pollId}`, { bank })
}

export default Pisp
