import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import M from "materialize-css"
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../App'

const Signin = () => {
  const { state, dispatch } = useContext(UserContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const PostData = (e) => {
    e.preventDefault()
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      M.toast({ html: 'Invalid Email', classes: '#b71c1c red darken-4' })
      return
    }
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }).then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.error) {
          M.toast({ html: data.error, classes: '#b71c1c red darken-4' })
        }
        else {
          localStorage.setItem("jwt", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
          dispatch({ type: "USER", payload: data.user })
          M.toast({ html: 'Signed in Successfully', classes: '#00e676 green accent-3' })
          navigate('/')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className='sections'>
      <div className="login-block">
        <h2>Chit Chat</h2>
        <form className="login-form common-form" onSubmit={(e)=>PostData(e)}>
          <input type="text" placeholder='Email' autoComplete='false' value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder='Password' autoComplete='false' value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type='submit'>Signin</button>
        </form>
        <div className="extra-info">
          <Link to="/signup">Don't have an account <b>Create One</b></Link>
        </div>
      </div>
    </div>
  )
}

export default Signin
