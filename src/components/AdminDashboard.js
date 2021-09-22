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
  const [electionStatus,setElectionStatus] = useState(false)
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
      console.log(response.data);
      if(response.data.message === "user is not an admin"){
        alert("unauthorize")
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      if(response.data.message ==="No election at the moment"){
        setElection(undefined);
      }
      if(response.data.message ==="completed"){
        setElection(response.data.data)
        let electionStatus = parseInt(response.data.data.status)
        setElectionStatus(electionStatus)
      }
      
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
  }, [showLinks,token]);
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
      {electionStatus?
        <div className={styles.election}>
          <h4 className={styles.result}>{election.name}</h4>
            <p className={styles.result}>{election.date}</p>
            {
              election.parties.map((payload)=>{
                let contestant = JSON.parse(payload.contestantName);
                let objectKeys = Object.keys(contestant);
                return <div>
                <h4 className={styles.result}>{payload.name}</h4>
                {objectKeys.map((payload)=>{
                  return <div>
                    <p className={styles.result}>{payload}: {contestant[`${payload}`]}</p>
                  </div>
                })
                }
                <p className={styles.result}>Votes: {payload.votes}</p>
                </div>
              })
            }
        </div>:null

      }
    </div>
  )
}

export default AdminDashboard
