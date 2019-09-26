import { Button } from '@material-ui/core'

import { StyledHref } from '../CommonStyled'

const LinkButton = ({ href, ...props }) => (
  <StyledHref href={href}>
    <Button {...props}>Sign in</Button>
  </StyledHref>
)

export default LinkButton
