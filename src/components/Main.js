import React from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import Home from './Home'
import Sign from './Sign'
import SignAdmin from './SignAdmin'

function Main() {
  return (
    <div>
      <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/sign-in" exact component={Sign} />
      <Route path="/sign-admin" exact component={SignAdmin} />
        <Redirect path="/" />
      </Switch>
    </div> 
  )
}

export default Main
