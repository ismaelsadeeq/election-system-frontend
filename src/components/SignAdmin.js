import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import Nav from './Nav'
import styles from './stylesheets/authStyle.module.css'
import axios from 'axios'
import {url} from './url'

function SignAdmin() {
  let history = useHistory();
  const [info,setInfo] = useState({
    "email":"",
    "password":"",
    "firstName":"",
    "lastName":"",
    "confirmPassword":""
  })
  const [signUp,setSignUp] = useState(false);
  const [signIn,setSignIn] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  function signUpSubmitHandler (e) {
    e.preventDefault();
    axios({
      method: 'post',
      url: `${url}/auth/admin-register`,
      data: info
    }).then(response=>{
      console.log(response.data);
      if(response.data.message === 'data is required'){
        alert("something went wrong");
        setSignUp(false)
        setSignIn(true)
      }
      if(response.data.message === 'account already exist sign in'){
        alert("you have an account sign-in")
        setSignUp(false)
        setSignIn(true)
      }
      if(response.data.message === 'Admin successfully created'){
        alert("account created sign in")
        setSignIn(true)
        setSignUp(false)
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }
  function submitHandler (e) {
    e.preventDefault();
    axios({
      method: 'post',
      url: `${url}/auth/admin-login`,
      data: info
    }).then(response=>{
      console.log(response.data);
      if(response.data.message === 'No account found'){
        setError(false)
        alert("no account with this email sign up")
        setSignIn(false)
        setSignUp(true)
      }
      if(response.data.message === 'Incorrect passsword'){
        setMessage('Incorrect Password')
        setError(true)
      }
      if(response.data){
        let token = response.data.token;
        let user = response.data.data;
        localStorage.setItem('token',JSON.stringify(token));
        localStorage.setItem('user',JSON.stringify(user));
        if(user.isAdmin === true){
          history.push('/admin-dashboard');
        }else{
          history.push('/dashboard');
        }
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }
  function changeHandler (e){
    const property = e.target.name;
    const value = e.target.value;
    setInfo(ev => ({
      ...ev,
      [property] : value,
    }))  
  }
  return (
    <div>
      <Nav />
      <div className={styles.sign}>
        <div className={styles.form}>
          { signIn?
            <div >
              <div className={styles.formHeading}>
                <h3>Hello Admin</h3>
                <p>Sign in your account to continue</p>
              </div>
              <div>
                <form className={styles.formContainer} onSubmit={(e)=>{submitHandler(e)}}>
                  <div className={styles.field}>
                    <label >Email</label>
                    <input   name="email" type="Email" placeholder="Enter Email" value={info.email} onChange={(e)=>{changeHandler(e)}} required></input>
                  </div>
                  <div className={styles.field}>
                    <label >Password</label>
                    <input name="password" type="password" placeholder="Password" value={info.password} onChange={(e)=>{changeHandler(e)}} required></input>
                  </div>
                  <button type="submit" className="button btn-success" >Sign in</button>
                  {
                    error?<p>{message}</p>:null
                  }
                  <p className={styles.link} onClick={()=>{
                    setSignIn(false)
                    setSignUp(true);
                  }}>Sign up</p>
                  <div>
                   <p className={styles.formButtomText}>Not an admin? <span ><a  href='/sign-in'>Sign in</a></span></p>
                  </div>
                </form>
              </div>
           </div>
              :null

          }
          {
            signUp?
            <div >
              <div className={styles.formHeading}>
                <h3>Sign up</h3>
                <p>sign up and create a password</p>
              </div>
              <div>
                <form className={styles.formContainer} onSubmit={(e)=>{signUpSubmitHandler(e)}}>
                  <div className={styles.field}>
                  <label >Email</label>
                    <input   name="email" type="email" placeholder="Enter Email" value={info.email} onChange={(e)=>{changeHandler(e)}} required></input>
                  </div>
                  <div className={styles.field}>
                  <label >Firstname</label>
                    <input   name="firstName" type="text" placeholder="First name" value={info.firstName} onChange={(e)=>{changeHandler(e)}} required></input>
                  </div>
                  <div className={styles.field}>
                  <label >Lastname</label>
                    <input   name="lastName" type="text" placeholder="Last name" value={info.lastName} onChange={(e)=>{changeHandler(e)}} required></input>
                  </div>
                  <div className={styles.field}>
                    <label >Password</label>
                    <input name="password" type="password" placeholder="Password" value={info.password} onChange={(e)=>{changeHandler(e)}} required></input>
                  </div>
                  <div className={styles.field}>
                    <label >Confirm password</label>
                    <input name="confirmPassword" type="password" placeholder="Confirm password" value={info.confirmPassword} onChange={(e)=>{changeHandler(e)}} required></input>
                  </div>
                  <button type="submit" className="button btn-success" >Sign up</button>
                  {
                    error?<p>{message}</p>:null
                  }
                    <a className={styles.link} onClick={()=>{
                    setSignIn(true)
                    setSignUp(false);
                  }}>Sign in</a>
                  <div>
                   <p className={styles.formButtomText}>Not an admin? <span ><a  href='/sign-in'>Sign in</a></span></p>
                  </div>
                </form>
              </div>
           </div>
              :null

          }
        </div>
      </div> 
    </div>
  ) 
}

export default SignAdmin
