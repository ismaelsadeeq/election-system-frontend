import React, { useState, useRef, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import styles from './stylesheets/navStyle.module.css'
import { useHistory } from "react-router-dom";
import {useGlobalContext} from './context/context'
import helpers from './helpers';
import {url} from './url'
import axios from 'axios';

function AdminDashboard() {
  let history = useHistory();
  const {
    token,
    setToken
  } = useGlobalContext();
  const [showLinks, setShowLinks] = useState(false);
  const [election,setElection] = useState(undefined)
  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);
  const toggleLinks = () => {
    setShowLinks(!showLinks);
  };
  const setTheToken = () =>{
    setToken(helpers.getToken());
    if(helpers.getToken() == null){
      history.push("/sign-in")
    }
  }
  const logOut = () =>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  const getElection = ()=>{
    axios({
      method: 'GET',
      url: `${url}/election/admin`,
      headers:{
        Authorization:`Bearer ${token}`
      }
    }).then(response =>{
      console.log(response.data)
    })
    .catch(error=>{
      console.log(error);
    })
  }
  useEffect(() => {
    const linksHeight = linksRef.current.getBoundingClientRect().height;
    if (showLinks) {
      linksContainerRef.current.style.height = `${linksHeight}px`;
    } else {
      linksContainerRef.current.style.height = '0px';
    }
    setTheToken()
    getElection()
  }, [showLinks,token,election]);
  return (
    <div>
      <nav className={styles.height}>
      <div className={styles.navCenter}>
        <div className={`${styles.navHeader}`}>
          INEC ADAMAWA STATE
          <button className={styles.navToggle} onClick={toggleLinks}>
            <FaBars />
          </button>
        </div>
        <div className={styles.linksContainer} ref={linksContainerRef}>
          <ul className={styles.links} ref={linksRef}>
          <li>
              <a href='/admin-dashboard'>home</a>
            </li>
            <li>
              <a href='/reg-pu'>polling unit</a>
            </li>
            <li>
              <a href='/sign-in' onClick={logOut}>logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
  )
}

export default AdminDashboard
