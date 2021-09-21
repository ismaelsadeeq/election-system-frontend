import React, { useState, useRef, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import styles from './stylesheets/navStyle.module.css'
import { useHistory } from "react-router-dom";
import {useGlobalContext} from './context/context'
import helpers from './helpers';

function RegisterPu() {
  let history = useHistory();
  const {
    token,
    setToken
  } = useGlobalContext();
  const [showLinks, setShowLinks] = useState(false);
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
  useEffect(() => {
    const linksHeight = linksRef.current.getBoundingClientRect().height;
    if (showLinks) {
      linksContainerRef.current.style.height = `${linksHeight}px`;
    } else {
      linksContainerRef.current.style.height = '0px';
    }
    setTheToken()
  }, [showLinks,token]);
  return (
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
  )
}

export default RegisterPu
