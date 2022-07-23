import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import logo from '../images/logo.svg'

const Navbar = () => {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(UserContext)
  const renderList = () => {
    if (state) {
      return [
        <li key={0}><Link to="/profile">Profile</Link></li>,
        <li key={1}><Link to="/createpost">Create Post</Link></li>,
        <li key={2}><Link to="/myFollowingPosts">Followings</Link></li>,
        <li key={3}>
          <button className="common-btn" onClick={()=>{
            localStorage.clear()
            dispatch({type:"CLEAR"})
            navigate('/signin')
          }}>Logout</button>
        </li>
      ]
    }
    else {
      return [
        <li key={5}><Link to="/signin">Signin</Link></li>,
        <li key={6}><Link to="/signup">Signup</Link></li>
      ]
    }
  }

  return (
    <div>
      <nav>
        <div className="nav-wrapper">
          <Link to={state ? "/" : "/signin"} className="brand-logo"><img src={logo} alt="Chit Chat" /></Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()}
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
