import { Button, CircularProgress } from '@material-ui/core'
import { red } from '@material-ui/core/colors'
import { memo, useContext, useState } from 'react'

import { AppContext } from '../../App'
import Image from '../Image'
import Query from '../Query'
import { Container, StyledCard, StyledLink, Title } from './styled'

const AuthorizationView = () => {
  const {
    services: { common, auth, aisp },
    enqueueSnackbar,
  } = useContext(AppContext)
  const [loading, setLoading] = useState({})

  return (
    <Container>
      <Query query={common.availableBanks}>
        {banks =>
          banks.map(({ code, name, logo }) => (
            <StyledCard key={code}>
              {logo ? (
                <Image
                  src={logo}
                  alt={name}
                  style={{ maxHeight: '50px', maxWidth: '180px' }}
                />
              ) : (
                <Title variant="h5">{name}</Title>
              )}
              <Query query={common.isAuthorized} params={{ bank: code }}>
                {(authorized, { refetch }) => {
                  if (loading[code]) {
                    return <CircularProgress />
                  }
                  if (authorized) {
                    return (
                      <Button
                        type="submit"
                        variant="contained"
                        style={{ backgroundColor: red.A700, color: 'white' }}
                        onClick={async () => {
                          setLoading({ ...loading, [code]: true })
                          await auth.revokeToken(code)
                          setLoading({ ...loading, [code]: false })
                          enqueueSnackbar('Authorization revoked!', {
                            variant: 'success',
                          })
                          aisp.clearCache()
                          refetch()
                        }}
                      >
                        Revoke
                      </Button>
                    )
                  }
                  return (
                    <Query query={auth.getAuthUrl} params={{ code }}>
                      {({ authUrl }) => (
                        <StyledLink href={authUrl}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                          >
                            Authorize
                          </Button>
                        </StyledLink>
                      )}
                    </Query>
                  )
                }}
              </Query>
            </StyledCard>
          ))
        }
      </Query>
    </Container>
  )
}

export default memo(AuthorizationView)
