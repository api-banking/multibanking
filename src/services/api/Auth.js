import Common from './Common'

class Auth extends Common {
  authCallbackUrl = `http://${window.location.host}/authorized`

  getAuthUrl = ({ code }) =>
    this.get('/auth', {
      bank: code,
      callbackUri: this.authCallbackUrl,
      scope: code === '5500' ? 'aisp' : ['aisp', 'pisp'],
    })

  authorize = ({ code }) =>
    this.post('/auth', {
      bank: code,
      callbackUri: this.authCallbackUrl,
      scope: code === '5500' ? 'aisp' : ['aisp', 'pisp'],
    })

  revokeToken = bank => this.delete('/token', { bank })
}

export default Auth
