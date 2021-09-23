import React, { useState, useRef, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import styles from './stylesheets/navStyle.module.css'
import { useHistory } from "react-router-dom";
import {useGlobalContext} from './context/context';
import style from './stylesheets/registerPu.module.css';
import {url} from './url'
import axios from 'axios';
import helpers from './helpers';

function RegisterPu() {
  const data = {
    name:''
  }
  let history = useHistory();
  const {
    token,
    setToken
  } = useGlobalContext();
  const [showLinks, setShowLinks] = useState(false);
  const [search,setSearch] = useState(true)
  const [info,setInfo] = useState(data)
  const [lga,setLga] = useState(undefined);
  const [count,setCount] =  useState(0)
  const [pu,setPu] = useState(false)
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
  const getLga  = async (e)=>{
    e.preventDefault()
    axios({
      method: 'POST', 
      url: `${url}/utilities/lga/name`,
      headers:{
        Authorization:`Bearer ${token}`
      },
      data:info
    }).then(response =>{
      console.log(response.data);
      if(response.data.message === "lga name is required"){
        info.name = undefined;
        return alert("lga name is required")
      }
      if(response.data.message ==="lga doest not exist"){
        info.name = undefined;
        return alert("local government does not exist")
      }
      if(response.data.message ==="successful"){
        setLga(response.data.data);
        setSearch(false)
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }
  const getPus = (e)=>{
    e.preventDefault()
    axios({
      method: 'GET',
      url: `${url}/utilities/lga/pu/${lga.id}?currentPage=${count}&pageLimit=10`,
      headers:{
        Authorization:`Bearer ${token}`
      },
      data:info
    }).then(response =>{
      console.log(response.data);
      if(response.data.message === "lga name is required"){
        info.name = undefined;
        return alert("lga name is required")
      }
      if(response.data.message ==="lga doest not exist"){
        info.name = undefined;
        return alert("local government does not exist")
      }
      if(response.data.message ==="successful"){
        setLga(response.data.data);
        setSearch(false)
      }
    })
    .catch(error=>{
      console.log(error);
    })
  }
  const quit = ()=>{
    setInfo(data)
    setSearch(true)
  }
  const searchPu =  async(req,res)=>{
    
  }
  function changeHandler (e){
    const property = e.target.name;
    const value = e.target.value;
    setInfo(ev => ({
      ...ev,
      [property] : value,
    })) 
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
      <div className={style.container}>
        {
          search?
            <div>
              <h3>Adamawa State Government</h3>
              <div className={style.field}>
                <label>Local Government</label>
                <input name="name" type="text" placeholder="Enter local government name" value={info.name} onChange={(e)=>{changeHandler(e)}} required/>
                <button className={style.btnn} onClick={(e)=>{getLga(e)}}>Search</button>
              </div>
            </div>
            :<div>
              <button className={style.btn} onClick={(e)=>{quit(e)}}>Back</button>
              <h3>{lga.name}</h3>
              <button className={style.btn} onClick={(e)=>{getPus(e)}}>Get polling units</button>
              <button className={style.btn} onClick={(e)=>{searchPu(e)}}>Search polling Unit</button>
            </div>
        }
        {

        }
      </div>
    </div>
  )
}

export default RegisterPu
