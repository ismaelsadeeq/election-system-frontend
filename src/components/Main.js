import React from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import Home from './Home'
import Sign from './Sign'
import SignAdmin from './SignAdmin'
import Dashboard from './Dashboard'
import AdminDashboard from './AdminDashboard'
import RegisterPu from './RegisterPu'

function Main() {
  return (
    <div>
      <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/sign-in" exact component={Sign} />
      <Route path="/sign-admin" exact component={SignAdmin} />
      <Route path="/dashboard" exact component={Dashboard} />
      <Route path="/admin-dashboard" exact component={AdminDashboard} />
      <Route path="/reg-pu" exact component={RegisterPu} />
      <Redirect path="/" />
      </Switch>
    </div> 
  )
}

export default Main
