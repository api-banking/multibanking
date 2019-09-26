import Image from '../Image'
import { ImageContainer, LabelContainer } from './styled'

const BankLabel = ({ name, logo }) => (
  <LabelContainer>
    <span>{name}</span>
    <ImageContainer>
      <Image src={logo} height="19" />
    </ImageContainer>
  </LabelContainer>
)

export default BankLabel
