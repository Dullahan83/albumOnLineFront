import {useContext} from "react"
import { Link } from 'react-router-dom'
import AuthContext from '../../Context/AuthContext'

const Navbar = () => {
  const {authState} = useContext(AuthContext)
  const {user} = authState
  return (
    <ul className='flex gap-10 justify-self-center translate-x-1/4'>
      <li>
        <Link to="/">Accueil</Link>
      </li>
      {user?.authorized && <>
      <li>
        <Link to="/album">Album</Link>
      </li>
      <li>
        <Link to="/upload">Télécharger</Link>
      </li>
      </>
      }
    </ul>
  )
}

export default Navbar
