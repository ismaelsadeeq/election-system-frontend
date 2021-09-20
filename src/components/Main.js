import React from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import Home from './Home'

function Main() {
  return (
    <div>
      <Switch>
      <Route path="/" exact component={Home} />
        <Redirect path="/" />
      </Switch>
    </div> 
  )
}

export default Main
