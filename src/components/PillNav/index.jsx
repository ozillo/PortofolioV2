import useMediaQuery from '../../hooks/useMediaQuery'
import PillNavDesktop from './PillNavDesktop'
import MobileStaggeredMenu from '../MobileStaggeredMenu/MobileStaggeredMenu'

export default function PillNav(props) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  return isMobile ? <MobileStaggeredMenu {...props} /> : <PillNavDesktop {...props} />
}
