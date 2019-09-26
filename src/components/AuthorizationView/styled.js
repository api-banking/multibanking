import { Card, Typography } from '@material-ui/core'
import styled from 'styled-components'

export const StyledLink = styled.a`
  text-decoration: none;
  margin: 10px;
`
export const StyledCard = styled(Card)`
  width: 225px;
  height: 150px;
  margin: 10px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
`
export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`
export const Title = styled(Typography)`
  text-align: center;
`
